import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  noBorder?: boolean
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6'
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  noBorder = false 
}: CardProps) {
  return (
    <div className={`bg-white ${!noBorder ? 'border border-[#e6e6e6]' : ''} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  )
}
