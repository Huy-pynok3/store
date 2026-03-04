interface StarRatingProps {
  rating: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl'
}

export default function StarRating({ rating, size = 'sm', className = '' }: StarRatingProps) {
  const stars = []
  
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<i key={i} className="fas fa-star"></i>)
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<i key={i} className="fas fa-star-half-alt"></i>)
    } else {
      stars.push(<i key={i} className="far fa-star"></i>)
    }
  }

  return (
    <div className={`flex gap-0.5 text-yellow-400 ${sizeClasses[size]} ${className}`}>
      {stars}
    </div>
  )
}
