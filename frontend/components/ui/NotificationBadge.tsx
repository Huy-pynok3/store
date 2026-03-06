interface NotificationBadgeProps {
  count: number | string
  position?: 'top-right' | 'top-left' | 'custom'
  size?: 'xs' | 'sm' | 'md'
  variant?: 'default' | 'red'
  className?: string
}

const sizeClasses = {
  xs: 'text-[8px] px-1 py-0.5',
  sm: 'text-[9px] w-3 h-3',
  md: 'text-[11px] min-w-[20px] h-[20px] px-1.5'
}

const positionClasses = {
  'top-right': 'absolute -top-[5px] -right-[5px]',
  'top-left': 'absolute -top-[5px] -left-[5px]',
  'custom': ''
}

const variantClasses = {
  default: 'bg-white text-black border-gray-300',
  red: 'bg-red-500 text-white border-red-500'
}

export default function NotificationBadge({ 
  count, 
  position = 'top-right',
  size = 'sm',
  variant = 'default',
  className = '' 
}: NotificationBadgeProps) {
  return (
    <span 
      className={`
        ${positionClasses[position]}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-bold rounded-full border
        flex items-center justify-center whitespace-nowrap
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {count}
    </span>
  )
}
