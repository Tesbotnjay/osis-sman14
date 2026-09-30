'use client'

import React, { useEffect, useRef } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  hideCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  hideCloseButton = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal-backdrop flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'relative z-modal w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {(!hideCloseButton || title) && (
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  {title && (
                    <h2 id="modal-title" className="text-xl font-heading font-semibold text-text-primary">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-text-secondary">{description}</p>
                  )}
                </div>
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-text-muted hover:bg-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
            
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
