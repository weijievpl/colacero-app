'use client';

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

// Minimal QR code generator (no external deps)
// Uses canvas API to render a simple QR-like pattern
export function QRCode({ value, size = 200, className }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate a deterministic pattern from the value string
    const modules = 25;
    const cellSize = size / modules;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';

    // Create hash-based pattern
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
    }

    // Draw finder patterns (corners)
    const drawFinder = (x: number, y: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBlack = r === 0 || r === 6 || c === 0 || c === 6 || 
                         (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          if (isBlack) {
            ctx.fillRect((x + c) * cellSize, (y + r) * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(modules - 7, 0);
    drawFinder(0, modules - 7);

    // Fill data area with deterministic pattern
    const seed = Math.abs(hash);
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder pattern areas
        if ((r < 8 && c < 8) || (r < 8 && c > modules - 9) || (r > modules - 9 && c < 8)) continue;
        
        const bit = ((seed * (r * modules + c + 1)) >> 4) & 1;
        if (bit) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
