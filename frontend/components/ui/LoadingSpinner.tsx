interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 border-2',
  md: 'w-16 h-16 border-[3px]',
  lg: 'w-24 h-24 border-4'
}

export default function LoadingSpinner({ size = 'md', color = 'primary' }: LoadingSpinnerProps) {
  const borderColor = color === 'primary' ? 'border-primary/20 border-t-primary' : `border-${color}/20 border-t-${color}`
  
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} ${borderColor} rounded-full animate-spin`}></div>
    </div>
  )
}
