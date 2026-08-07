interface SparkLineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
}

export function SparkLine({ data, color = '#1B3A5C', width = 80, height = 32 }: SparkLineProps) {
  if (!data.length) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padX = 2
  const padY = 2
  const w = width - padX * 2
  const h = height - padY * 2

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * w
    const y = padY + h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Last dot */}
      {data.length > 0 && (() => {
        const last = data[data.length - 1]
        const x = padX + w
        const y = padY + h - ((last - min) / range) * h
        return <circle cx={x} cy={y} r={2.5} fill={color} />
      })()}
    </svg>
  )
}
