interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-[120px] w-[120px]'
}

export default function Avatar({ 
  src = 'https://mimity-admin896.netlify.app/dist/img/user.svg',
  alt = 'Avatar',
  size = 'sm',
  className = ''
}: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full border border-[#d7d7d7] bg-white object-cover ${className}`}
    />
  )
}
