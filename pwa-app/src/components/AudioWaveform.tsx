import { useEffect, useRef } from 'react'

interface AudioWaveformProps {
  isRecording: boolean
  height?: number
}

export default function AudioWaveform({ isRecording, height = 60 }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      
      ctx.clearRect(0, 0, width, height)
      
      if (!isRecording) return

      // Draw animated waveform bars
      const barCount = 20
      const barWidth = width / barCount
      const time = Date.now() * 0.01

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'

      for (let i = 0; i < barCount; i++) {
        const barHeight = Math.sin(time + i * 0.5) * (height * 0.3) + height * 0.2
        const x = i * barWidth
        const y = (height - barHeight) / 2

        ctx.fillRect(x, y, barWidth - 2, barHeight)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    if (isRecording) {
      draw()
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRecording, height])

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={height}
      className="w-full max-w-xs mx-auto"
      style={{ height: `${height}px` }}
    />
  )
}