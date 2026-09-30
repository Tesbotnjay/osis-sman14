'use client';

import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './mobile-menu';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/program-kerja', label: 'Program Kerja' },
  { href: '/kepengurusan', label: 'Kepengurusan' },
  { href: '/ekstrakurikuler', label: 'Ekstrakurikuler' },
  { href: '/dokumentasi', label: 'Dokumentasi' },
  { href: '/kalender', label: 'Kalender' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent',
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-secondary/20 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-sm tracking-wider">
              OSIS
            </div>
            <span className={cn(
              "font-heading font-bold text-lg hidden sm:block transition-colors",
              isScrolled ? "text-primary" : "text-primary"
            )}>
              SMA Negeri 14 Samarinda
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors hover:bg-secondary/50",
                  "text-primary/70 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild className="hidden md:flex rounded-full px-6 font-semibold bg-primary hover:bg-primary/90 text-white">
              <Link href="/w-spiras">W-SPIRAS</Link>
            </Button>
            
            <button
              className="lg:hidden p-2 text-primary focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        links={NAV_LINKS} 
      />
    </>
  );
}
