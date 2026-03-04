interface StatusBadgeProps {
  status: string
  type?: 'success' | 'warning' | 'danger' | 'info' | 'pending'
  className?: string
}

const statusColors = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  pending: 'bg-gray-500'
}

export default function StatusBadge({ 
  status, 
  type = 'info',
  className = '' 
}: StatusBadgeProps) {
  return (
    <span className={`${statusColors[type]} text-white text-xs px-2.5 py-1 rounded inline-block whitespace-nowrap ${className}`}>
      {status}
    </span>
  )
}
