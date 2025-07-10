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
        <label className="form-label">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'form-input',
          error && 'border-accent-500 focus:ring-accent-500',
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