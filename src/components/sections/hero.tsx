'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image Placeholder with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary/70 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent z-10" />
        {/* Replace src with actual image from Supabase Storage */}
        <div className="w-full h-full bg-slate-200 object-cover" />
      </div>

      <div className="container relative z-20 mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center text-center mt-10 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-4"
        >
          <span className="text-secondary/90 font-heading font-bold tracking-[0.3em] text-sm md:text-base uppercase mb-4 block">
            Periode 2026/2027
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="font-heading font-extrabold text-white text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none mb-6"
        >
          OSIS
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="font-heading font-bold text-white/90 text-2xl md:text-4xl lg:text-5xl tracking-wide max-w-4xl leading-tight mb-10"
        >
          SMA NEGERI 14 SAMARINDA
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-secondary text-primary hover:bg-white hover:text-primary rounded-full px-8 py-6 text-lg font-bold group"
          >
            <Link href="/program-kerja">
              Lihat Program Kerja
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-white/50 text-white hover:bg-white/10 hover:text-white rounded-full px-8 py-6 text-lg font-bold backdrop-blur-sm"
          >
            <Link href="/w-spiras">
              <MessageSquare className="mr-2 w-5 h-5" />
              Sampaikan Aspirasi
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div 
            className="w-full h-1/2 bg-white absolute top-0"
            animate={{ top: ['-50%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
