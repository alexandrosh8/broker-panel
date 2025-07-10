import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '../../utils/cn'

const Select = React.forwardRef(({
  className,
  label,
  error,
  children,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm appearance-none',
            'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
            'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'dark:focus:ring-primary-400 dark:focus:border-primary-400',
            'transition-colors duration-200',
            'pr-10',
            error && 'border-accent-500 focus:ring-accent-500 focus:border-accent-500',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-accent-600 dark:text-accent-400">
          {error}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select