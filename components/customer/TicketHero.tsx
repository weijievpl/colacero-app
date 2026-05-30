'use client';
// Required: Uses Framer Motion for animations

import { motion } from 'framer-motion';

interface TicketHeroProps {
  number: number;
}

export function TicketHero({ number }: TicketHeroProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <span 
        className="font-mono text-7xl font-bold tracking-tight text-primary md:text-9xl"
        aria-label={`Ticket number ${number}`}
      >
        {number.toString().padStart(2, '0')}
      </span>
    </motion.div>
  );
}
