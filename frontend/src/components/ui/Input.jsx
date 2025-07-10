import React from 'react'
import { cn } from '../../utils/cn'

const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  error,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm',
          'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
          'placeholder-neutral-500 dark:placeholder-neutral-400',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'dark:focus:ring-primary-400 dark:focus:border-primary-400',
          'transition-colors duration-200',
          error && 'border-accent-500 focus:ring-accent-500 focus:border-accent-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-accent-600 dark:text-accent-400">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input