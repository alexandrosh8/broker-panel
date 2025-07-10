import React from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('card-header', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('card-body', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold text-neutral-900 dark:text-neutral-100', className)} {...props}>
      {children}
    </h3>
  )
}