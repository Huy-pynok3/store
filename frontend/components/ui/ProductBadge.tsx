interface ProductBadgeProps {
  type: 'product' | 'no-duplicate' | 'warehouse' | 'refund' | 'custom'
  text?: string
  variant?: 'success' | 'info' | 'warning'
  size?: 'xs' | 'sm'
  className?: string
}

const variantColors = {
  success: 'bg-green-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-orange-500 text-white'
}

const sizeClasses = {
  xs: 'text-[10px] px-2 py-0.5',
  sm: 'text-[11px] px-2 py-1'
}

const badgeText = {
  'product': 'Sản phẩm',
  'no-duplicate': 'KHÔNG TRÙNG',
  'warehouse': 'KHO TAPHOAMMO',
  'refund': 'KÊNH GIA HOÀN TIỀN',
  'custom': ''
}

export default function ProductBadge({ 
  type, 
  text, 
  variant = 'success',
  size = 'xs',
  className = ''
}: ProductBadgeProps) {
  const displayText = type === 'custom' ? text : badgeText[type]
  
  return (
    <span className={`inline-block font-medium rounded ${variantColors[variant]} ${sizeClasses[size]} ${className}`}>
      {displayText}
    </span>
  )
}
