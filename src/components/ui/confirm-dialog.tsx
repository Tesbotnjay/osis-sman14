'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './modal'
import { Button } from './button'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  isDestructive = true,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
        <div
          className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
            isDestructive ? 'bg-red-100 text-error' : 'bg-secondary text-primary'
          }`}
        >
          <AlertTriangle className="h-6 w-6 sm:h-5 sm:w-5" aria-hidden="true" />
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <h3 className="text-lg font-heading font-semibold text-text-primary" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="mt-3 sm:mt-0 w-full sm:w-auto"
        >
          {cancelText}
        </Button>
        <Button
          variant={isDestructive ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
          className="w-full sm:w-auto sm:ml-3"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}
