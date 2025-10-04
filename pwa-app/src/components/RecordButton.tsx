import { Mic, Square } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface RecordButtonProps {
  isRecording: boolean
  duration: number
  onStart: () => void
  onStop: () => void
  disabled?: boolean
}

export default function RecordButton({ 
  isRecording, 
  duration, 
  onStart, 
  onStop, 
  disabled 
}: RecordButtonProps) {
  const handleClick = () => {
    if (isRecording) {
      onStop()
    } else {
      onStart()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-200
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-white hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isRecording ? (
          <Square className="w-8 h-8 text-white" fill="currentColor" />
        ) : (
          <Mic className={`w-8 h-8 ${disabled ? 'text-gray-400' : 'text-linkedin-600'}`} />
        )}
      </button>

      {isRecording && (
        <div className="text-center">
          <div className="text-white text-2xl font-mono font-bold">
            {formatDuration(duration)}
          </div>
          <p className="text-white/80 text-sm">Recording...</p>
        </div>
      )}

      {!isRecording && !disabled && (
        <p className="text-white text-sm">
          Tap to start recording
        </p>
      )}
    </div>
  )
}