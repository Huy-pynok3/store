import { SalesPoint } from '../types'

interface SalesChartCardProps {
  data: SalesPoint[]
}

const chartWidth = 1120
const chartHeight = 360
const margin = { top: 24, right: 24, bottom: 42, left: 60 }
const innerWidth = chartWidth - margin.left - margin.right
const innerHeight = chartHeight - margin.top - margin.bottom

function getLinePath(points: Array<{ x: number; y: number }>) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ')
}

export default function SalesChartCard({ data }: SalesChartCardProps) {
  const maxValue = Math.max(...data.map((entry) => entry.value), 100000)
  const ySteps = 9
  const yTicks = Array.from({ length: ySteps + 1 }, (_, index) => Math.round((maxValue / ySteps) * index))

  const points = data.map((entry, index) => {
    const x = margin.left + (index * innerWidth) / Math.max(data.length - 1, 1)
    const y = margin.top + innerHeight - (entry.value / maxValue) * innerHeight
    return { x, y, ...entry }
  })

  const linePath = getLinePath(points)

  return (
    <section className="rounded-md border border-[#dfe4ef] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-2xl font-semibold text-[#1f2937]">
        <i className="fa-solid fa-chart-line text-[18px] text-[#4b5563]" aria-hidden="true" />
        30 ngày gần nhất
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="min-w-[1000px]">
          <g>
            {yTicks.map((tick) => {
              const y = margin.top + innerHeight - (tick / maxValue) * innerHeight
              return (
                <g key={tick}>
                  <line x1={margin.left} y1={y} x2={chartWidth - margin.right} y2={y} stroke="#e7ebf2" strokeWidth="1" />
                  <text x={margin.left - 10} y={y + 4} textAnchor="end" className="fill-[#6b7280] text-[11px]">
                    {tick.toLocaleString('vi-VN')}
                  </text>
                </g>
              )
            })}

            {points.map((point) => (
              <line
                key={point.date}
                x1={point.x}
                y1={margin.top}
                x2={point.x}
                y2={chartHeight - margin.bottom}
                stroke="#f2f4f8"
                strokeWidth="1"
              />
            ))}

            <path d={linePath} fill="none" stroke="#4f8ecf" strokeWidth="3" />
            {points.map((point) => (
              <circle key={`${point.date}-dot`} cx={point.x} cy={point.y} r="3" fill="#4f8ecf" />
            ))}

            {points.map((point) => (
              <text
                key={`${point.date}-label`}
                x={point.x}
                y={chartHeight - 14}
                textAnchor="middle"
                className="fill-[#9ca3af] text-[10px]"
              >
                {point.date}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </section>
  )
}
