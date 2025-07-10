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
        <label className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'form-input appearance-none pr-10',
            error && 'border-accent-500 focus:ring-accent-500',
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