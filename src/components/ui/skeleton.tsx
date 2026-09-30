import React from 'react'
import { clsx, type ClassValue } from 'clsx'

function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-secondary/60', className)}
      {...props}
    />
  )
}
