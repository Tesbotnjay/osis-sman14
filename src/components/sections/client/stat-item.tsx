'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

interface StatItemProps {
  value: number;
  label: string;
  delay?: number;
}

export function StatItem({ value, label, delay = 0 }: StatItemProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const controls = animate(count, value, {
        duration: 2,
        delay: delay,
        ease: 'easeOut',
      });
      setHasAnimated(true);
      return controls.stop;
    }
  }, [isInView, value, count, delay, hasAnimated]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6">
      <motion.div className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl text-white mb-2">
        {rounded}
      </motion.div>
      <div className="text-secondary/80 font-medium text-sm md:text-base uppercase tracking-wider text-center">
        {label}
      </div>
    </div>
  );
}
