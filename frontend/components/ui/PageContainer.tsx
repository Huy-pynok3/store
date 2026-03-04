import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

const maxWidthClasses = {
  sm: 'max-w-[1020px]',
  md: 'max-w-[1120px]',
  lg: 'max-w-[1440px]',
  xl: 'max-w-[1600px]',
  full: 'max-w-full'
}

export default function PageContainer({ 
  children, 
  maxWidth = 'xl',
  className = '' 
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-[#f2f2f2] py-6">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-3 ${className}`}>
        {children}
      </div>
    </div>
  )
}
