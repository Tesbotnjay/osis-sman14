'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItemProps {
  value: number;
  label: string;
  delay?: number;
}

export function StatItem({ value, label, delay = 0 }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: delay }}
        className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl text-white mb-2"
      >
        {value}
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
        className="text-secondary/80 font-medium text-sm md:text-base uppercase tracking-wider text-center"
      >
        {label}
      </motion.div>
    </div>
  );
}
