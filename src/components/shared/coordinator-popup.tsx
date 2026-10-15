'use client'

import { useEffect, useState, useRef, type MouseEvent, useCallback } from 'react'
import Image from 'next/image'
import { AtSign, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Portal } from '@/components/shared/portal'

interface CoordinatorPopupProps {
  isOpen: boolean
  onClose: () => void
  name: string
  position: string
  instagram: string
  photo_url: string | null
}

export function CoordinatorPopup({
  isOpen,
  onClose,
  name,
  position,
  instagram,
  photo_url,
}: CoordinatorPopupProps) {
  const scrollPosRef = useRef(0)

  // Lock scroll on body, save position
  useEffect(() => {
    if (isOpen) {
      scrollPosRef.current = window.scrollY
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.touchAction = 'none'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPosRef.current}px`
      document.body.style.width = '100%'
      document.body.style.overscrollBehavior = 'contain'
    }
    return () => {
      if (isOpen) {
        document.documentElement.style.overflow = ''
        document.documentElement.style.touchAction = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overscrollBehavior = ''
        window.scrollTo(0, scrollPosRef.current)
      }
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
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
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-modal-backdrop flex items-center justify-center p-4 sm:p-6 pt-safe pb-safe"
            style={{
              paddingTop: 'max(1rem, env(safe-area-inset-top))',
              paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
              paddingLeft: 'max(1rem, env(safe-area-inset-left))',
              paddingRight: 'max(1rem, env(safe-area-inset-right))',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleBackdropClick}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
              style={{
                top: 'env(safe-area-inset-top)',
                left: 'env(safe-area-inset-left)',
                right: 'env(safe-area-inset-right)',
                bottom: 'env(safe-area-inset-bottom)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-modal w-full rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden isolate"
              style={{
                maxWidth: 'clamp(280px, 100% - 2rem, 480px)',
                maxHeight: 'clamp(200px, calc(100dvh - 2rem), calc(100vh - 2rem))',
                backgroundColor: 'rgb(255, 255, 255)',
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="coordinator-popup-title"
            >
              {/* Header */}
              <div className="shrink-0 flex items-center justify-between border-b border-secondary/30 px-4 sm:px-6 py-3 sm:py-4 bg-white"
                style={{
                  paddingTop: 'max(0.75rem, calc(0.75rem + env(safe-area-inset-top)))',
                  paddingLeft: 'max(1rem, calc(1rem + env(safe-area-inset-left)))',
                  paddingRight: 'max(1rem, calc(1rem + env(safe-area-inset-right)))',
                }}
              >
                <div className="min-w-0">
                  <h2
                    id="coordinator-popup-title"
                    className="text-lg sm:text-xl font-heading font-bold text-primary truncate"
                  >
                    {position}
                  </h2>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-primary/60 truncate">
                    OSIS SMA Negeri 14 Samarinda
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 ml-2 rounded-full p-2 text-primary/60 hover:bg-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 touch-min-[44px]"
                  aria-label="Close popup"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-6 flex-1 bg-white"
                style={{
                  paddingLeft: 'max(1rem, calc(1rem + env(safe-area-inset-left)))',
                  paddingRight: 'max(1rem, calc(1rem + env(safe-area-inset-right)))',
                }}
              >
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 overflow-hidden relative border-4 border-white shadow-lg shrink-0">
                    {photo_url ? (
                      <Image
                        src={photo_url.includes('ibb.co') ? `/api/protected-image?url=${encodeURIComponent(photo_url)}` : photo_url}
                        alt={name}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="text-2xl sm:text-3xl text-primary/40 font-bold">{name.charAt(0)}</div>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-1 break-words">
                    {name}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full mb-4 flex-wrap justify-center">
                    <span className="text-xs sm:text-sm font-semibold text-primary">
                      {position}
                    </span>
                  </div>
                </div>

                <div className="border-t border-secondary/20 pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <AtSign size={20} className="text-primary/60 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-primary/60">Instagram</p>
                        <p className="font-medium text-primary text-sm break-all">{instagramHandle}</p>
                      </div>
                    </div>
                    <Button
                      onClick={openInstagram}
                      variant="outline"
                      size="sm"
                      className="gap-2 shrink-0 touch-min-[44px]"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <AtSign size={16} />
                      <span className="hidden sm:inline">Kunjungi</span>
                      <span className="sm:hidden">Buka</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-secondary/20 px-4 sm:px-6 py-3 sm:py-4 bg-secondary/10 flex justify-between items-center gap-2"
                style={{
                  paddingBottom: 'max(1rem, calc(1rem + env(safe-area-inset-bottom)))',
                  paddingLeft: 'max(1rem, calc(1rem + env(safe-area-inset-left)))',
                  paddingRight: 'max(1rem, calc(1rem + env(safe-area-inset-right)))',
                }}
              >
                <p className="text-xs text-primary/40 break-words flex-1">
                  Klik nama untuk info.
                </p>
                <Button onClick={onClose} variant="ghost" size="sm" className="shrink-0 touch-min-[44px]" style={{ minWidth: '44px', minHeight: '44px' }}>
                  Tutup
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
