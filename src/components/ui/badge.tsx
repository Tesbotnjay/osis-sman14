import React from 'react'
import { clsx, type ClassValue } from 'clsx'

function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        {
          'border-transparent bg-secondary text-primary': variant === 'default',
          'border-transparent bg-green-100 text-success': variant === 'success',
          'border-transparent bg-yellow-100 text-warning': variant === 'warning',
          'border-transparent bg-red-100 text-error': variant === 'error',
          'text-text-primary border-border': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}
