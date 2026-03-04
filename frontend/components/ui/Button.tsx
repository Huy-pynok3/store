import { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}

const variantClasses = {
  primary: 'bg-[#21abc6] hover:bg-[#1c9bb3] text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  warning: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2 text-sm',
  lg: 'px-8 py-2.5 text-base'
}

// Simple class merge utility
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded transition-colors'
  
  // Skip variant if custom bg/text/hover provided
  const hasCustomStyles = className.includes('bg-') || className.includes('text-') || className.includes('hover:')
  const hasCustomPadding = className.includes('px-') || className.includes('py-')
  
  return (
    <button
      className={cn(
        baseClasses,
        !hasCustomStyles && variantClasses[variant],
        !hasCustomPadding && sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
