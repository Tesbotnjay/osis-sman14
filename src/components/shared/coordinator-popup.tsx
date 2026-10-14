'use client'

import { useState, useEffect, type MouseEvent } from 'react'
import { AtSign, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface CoordinatorPopupProps {
  isOpen: boolean
  onClose: () => void
  name: string
  position: string
  instagram: string
}

export function CoordinatorPopup({
  isOpen,
  onClose,
  name,
  position,
  instagram,
}: CoordinatorPopupProps) {
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Close when clicking outside
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const openInstagram = () => {
    window.open(instagram, '_blank', 'noopener,noreferrer')
  }

  // Extract handle from Instagram URL
  const instagramHandle = instagram.includes('/') 
    ? '@' + instagram.split('/').pop()?.split('?')[0] 
    : instagram

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal-backdrop flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-primary/20 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-modal w-full max-w-md rounded-2xl bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="coordinator-popup-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-secondary/30 px-6 py-4">
              <div>
                <h2
                  id="coordinator-popup-title"
                  className="text-xl font-heading font-bold text-primary"
                >
                  {position}
                </h2>
                <p className="mt-1 text-sm text-primary/60">
                  OSIS SMA Negeri 14 Samarinda
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-primary/60 hover:bg-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Close popup"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="text-3xl text-primary/40 font-bold">
                    {name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-primary mb-1">
                  {name}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full mb-4">
                  <span className="text-sm font-semibold text-primary">
                    {position}
                  </span>
                </div>
              </div>

              <div className="border-t border-secondary/20 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AtSign size={20} className="text-primary/60" />
                    <div>
                      <p className="text-sm text-primary/60">Instagram</p>
                      <p className="font-medium text-primary">{instagramHandle}</p>
                    </div>
                  </div>
                  <Button
                    onClick={openInstagram}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <AtSign size={16} />
                    Kunjungi
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-secondary/20 px-6 py-4 bg-secondary/10 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <p className="text-xs text-primary/40">
                  Klik nama di struktur kepengurusan untuk membuka informasi ini.
                </p>
                <Button onClick={onClose} variant="ghost" size="sm">
                  Tutup
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
