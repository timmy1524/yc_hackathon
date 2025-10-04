import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Brain, Loader } from 'lucide-react'
import { useSupabase } from '@/hooks/useSupabase'

export default function ProcessingScreen() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const { getConversation } = useSupabase()
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!conversationId) return

    const checkProcessing = async () => {
      const conversation = await getConversation(conversationId)
      
      if (conversation?.processed) {
        navigate(`/success/${conversationId}`)
      }
    }

    // Check immediately
    checkProcessing()

    // Then check every 2 seconds
    const interval = setInterval(checkProcessing, 2000)

    // Timeout after 2 minutes
    const timeout = setTimeout(() => {
      navigate(`/success/${conversationId}`)
    }, 120000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [conversationId, getConversation, navigate])

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md">
        {/* AI Brain Animation */}
        <div className="relative">
          <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Brain className="w-12 h-12 text-linkedin-600" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
        </div>

        {/* Processing Text */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">
            AI is analyzing your conversation{dots}
          </h1>
          <div className="space-y-2">
            <p className="text-white/80">
              ✨ Transcribing audio with OpenAI Whisper
            </p>
            <p className="text-white/80">
              🧠 Analyzing conversation with GPT-4
            </p>
            <p className="text-white/80">
              📊 Generating insights and summary
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center gap-3">
          <Loader className="w-5 h-5 text-white animate-spin" />
          <span className="text-white/80">This usually takes 10-30 seconds</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full animate-pulse" style={{
            animation: 'progress 3s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  )
}