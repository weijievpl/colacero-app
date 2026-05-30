'use client';
// Required: Uses Framer Motion for hover effects

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardContent className="flex items-center gap-4 p-4">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
