import { useState } from 'react'
import { Conversation, AIAction } from '@/types'

const MOCK_CONVERSATIONS: Record<string, Conversation> = {
  '1': {
    id: 'conv-1',
    user_id: 'user-1',
    contact_id: '1',
    audio_url: '',
    transcription: 'Discussed AI automation solutions for their sales team...',
    summary: 'Sarah is interested in implementing AI automation for their sales processes. She mentioned they have a team of 50+ sales reps and are looking for solutions to improve response times and lead qualification.',
    key_topics: ['AI automation', 'Sales optimization', 'Lead qualification', 'Response time'],
    ai_analysis: {
      sentiment: 'positive',
      action_items: ['Send demo proposal', 'Schedule technical call', 'Prepare ROI analysis']
    },
    duration_seconds: 1247,
    recorded_at: '2024-01-15T10:30:00Z',
    processed: true
  },
  '2': {
    id: 'conv-2',
    user_id: 'user-1',
    contact_id: '2',
    audio_url: '',
    transcription: 'Talked about engineering best practices and team scaling...',
    summary: 'Mike shared insights about scaling engineering teams and discussed challenges with code review processes. Interested in automation tools for developer productivity.',
    key_topics: ['Engineering management', 'Team scaling', 'Code review', 'Developer productivity'],
    ai_analysis: {
      sentiment: 'neutral',
      action_items: ['Share engineering resources', 'Connect with dev team', 'Follow up on tooling']
    },
    duration_seconds: 892,
    recorded_at: '2024-01-16T14:20:00Z',
    processed: true
  }
}

const MOCK_AI_ACTIONS: Record<string, AIAction[]> = {
  '1': [
    {
      id: 'action-1',
      user_id: 'user-1',
      contact_id: '1',
      action_type: 'connection_request',
      action_content: 'Hi Sarah! Great meeting you at the conference. I\'d love to continue our conversation about AI automation for your sales team.',
      success: true,
      metadata: {},
      created_at: '2024-01-15T11:00:00Z'
    },
    {
      id: 'action-2',
      user_id: 'user-1',
      contact_id: '1',
      action_type: 'message_sent',
      action_content: 'Thanks for connecting! As discussed, I\'ve prepared some initial thoughts on how AI could streamline your lead qualification process. Would you be interested in a quick demo?',
      success: true,
      metadata: {},
      created_at: '2024-01-16T09:30:00Z'
    }
  ],
  '2': [
    {
      id: 'action-3',
      user_id: 'user-1',
      contact_id: '2',
      action_type: 'connection_request',
      action_content: 'Hi Mike! Enjoyed our conversation about engineering practices. Would love to stay connected and share resources.',
      success: true,
      metadata: {},
      created_at: '2024-01-16T15:00:00Z'
    }
  ]
}

export function useMockConversations() {
  const [loading, setLoading] = useState(false)

  const getConversationData = async (contactId: string) => {
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const conversation = MOCK_CONVERSATIONS[contactId] || null
    const aiActions = MOCK_AI_ACTIONS[contactId] || []
    
    setLoading(false)
    
    return { conversation, aiActions }
  }

  return {
    loading,
    getConversationData
  }
}