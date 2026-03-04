interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const sizeConfig = {
  sm: { container: 34, radius: 12, dot: 5 },
  md: { container: 54, radius: 20, dot: 7 },
  lg: { container: 76, radius: 30, dot: 9 },
} as const

const colorMap: Record<string, string> = {
  // primary: '#18c3a4',
  primary: '#22c55e',
  teal: '#18c3a4',
  blue: '#3b82f6',
  gray: '#94a3b8',
}

const DOT_COUNT = 10

export default function LoadingSpinner({ size = 'md', color = 'primary' }: LoadingSpinnerProps) {
  const cfg = sizeConfig[size]
  const dotColor = colorMap[color] ?? colorMap.primary

  return (
    <div className="flex items-center justify-center" aria-label="Dang tai" role="status">
      <div className="relative animate-spin" style={{ width: cfg.container, height: cfg.container, animationDuration: '1.35s' }}>
        {Array.from({ length: DOT_COUNT }).map((_, index) => {
          const angle = (360 / DOT_COUNT) * index
          const opacity = 0.18 + (index / DOT_COUNT) * 0.82
          return (
            <span
              key={index}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: cfg.dot,
                height: cfg.dot,
                backgroundColor: dotColor,
                opacity,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${cfg.radius}px)`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
