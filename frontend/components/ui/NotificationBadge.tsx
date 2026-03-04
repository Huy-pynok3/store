interface NotificationBadgeProps {
  count: number | string
  position?: 'top-right' | 'top-left' | 'custom'
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

const sizeClasses = {
  xs: 'text-[8px] px-1 py-0.5',
  sm: 'text-[9px] w-3 h-3',
  md: 'text-[10px] px-2 py-1'
}

const positionClasses = {
  'top-right': 'absolute -top-[5px] -right-[5px]',
  'top-left': 'absolute -top-[5px] -left-[5px]',
  'custom': ''
}

export default function NotificationBadge({ 
  count, 
  position = 'top-right',
  size = 'sm',
  className = '' 
}: NotificationBadgeProps) {
  return (
    <span 
      className={`
        ${positionClasses[position]}
        ${sizeClasses[size]}
        bg-white text-black font-bold rounded-full border border-gray-300
        flex items-center justify-center whitespace-nowrap
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {count}
    </span>
  )
}
