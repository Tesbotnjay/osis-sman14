'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useRef } from 'react';

interface StatItemProps {
  value: number;
  label: string;
  delay?: number;
}

function StatItem({ value, label, delay = 0 }: StatItemProps) {
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

export function Statistics() {
  const stats = [
    { label: 'Anggota Pengurus', value: 45 },
    { label: 'Ekstrakurikuler', value: 18 },
    { label: 'Program Kerja', value: 32 },
    { label: 'Kegiatan Tahunan', value: 12 },
  ];

  return (
    <section className="py-20 md:py-28 bg-primary relative">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="container-editorial relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/10">
          {stats.map((stat, index) => (
            <StatItem 
              key={stat.label} 
              value={stat.value} 
              label={stat.label} 
              delay={index * 0.1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
