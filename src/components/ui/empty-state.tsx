import React from 'react'
import { clsx, type ClassValue } from 'clsx'

function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface p-8 text-center animate-in fade-in duration-500',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          {icon}
        </div>
      )}
      <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-text-secondary">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
