import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, MessageSquare, Tag, ArrowRight, RotateCcw, Chrome } from 'lucide-react'
import { useSupabase } from '@/hooks/useSupabase'
import { Conversation } from '@/types'

export default function SuccessScreen() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const { getConversation } = useSupabase()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) return

    const loadConversation = async () => {
      const data = await getConversation(conversationId)
      setConversation(data)
      setLoading(false)
    }

    loadConversation()
  }, [conversationId, getConversation])

  const handleRecordAnother = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-white text-lg">Conversation not found</div>
          <button
            onClick={handleRecordAnother}
            className="bg-white text-linkedin-600 px-6 py-3 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Conversation Analyzed Successfully!
          </h1>
          <p className="text-white/80">
            AI has processed your conversation and extracted key insights.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 space-y-6">
          {/* Summary */}
          {conversation.summary && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-linkedin-600" />
                <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {conversation.summary}
              </p>
            </div>
          )}

          {/* Key Topics */}
          {conversation.key_topics && conversation.key_topics.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-linkedin-600" />
                <h2 className="text-lg font-semibold text-gray-900">Key Topics</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {conversation.key_topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-linkedin-100 text-linkedin-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          {conversation.ai_analysis?.action_items && conversation.ai_analysis.action_items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-linkedin-600" />
                <h2 className="text-lg font-semibold text-gray-900">Next Steps</h2>
              </div>
              <ul className="space-y-2">
                {conversation.ai_analysis.action_items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-linkedin-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sentiment */}
          {conversation.ai_analysis?.sentiment && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Sentiment</h2>
              <div className={`
                inline-block px-3 py-1 rounded-full text-sm font-medium
                ${conversation.ai_analysis.sentiment === 'positive' 
                  ? 'bg-green-100 text-green-700'
                  : conversation.ai_analysis.sentiment === 'negative'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
                }
              `}>
                {conversation.ai_analysis.sentiment.charAt(0).toUpperCase() + 
                 conversation.ai_analysis.sentiment.slice(1)}
              </div>
            </div>
          )}
        </div>

        {/* Chrome Extension Tip */}
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Chrome className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Pro Tip: Install Chrome Extension
              </h3>
              <p className="text-white/80 text-sm">
                Install our Chrome extension to automatically manage LinkedIn connections 
                and enable AI autopilot responses based on this conversation.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRecordAnother}
            className="w-full bg-white text-linkedin-600 py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Record Another Conversation
          </button>
        </div>
      </div>
    </div>
  )
}