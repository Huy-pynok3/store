import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary'
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

const variantClasses = {
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-400 text-gray-900',
  danger: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  primary: 'bg-[#21abc6] text-white'
}

const sizeClasses = {
  xs: 'text-[10px] px-2 py-0.5',
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5'
}

export default function Badge({ 
  children, 
  variant = 'success', 
  size = 'sm',
  className = '' 
}: BadgeProps) {
  return (
    <span className={`inline-block rounded font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  )
}
