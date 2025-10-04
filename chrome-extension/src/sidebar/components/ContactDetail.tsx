import { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, Building, Calendar, MessageSquare, Settings, Send } from 'lucide-react'
import { Contact, Conversation, AIAction } from '@/types'
import { supabase } from '@/lib/supabase'
import AutoPilotToggle from './AutoPilotToggle'
import RelationshipSettings from './RelationshipSettings'

interface ContactDetailProps {
  contact: Contact
  onBack: () => void
  onContactUpdate: (contactId: string, updates: Partial<Contact>) => void
}

export default function ContactDetail({ contact, onBack, onContactUpdate }: ContactDetailProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [aiActions, setAiActions] = useState<AIAction[]>([])
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadConversationData()
  }, [contact.id])

  const loadConversationData = async () => {
    try {
      setLoading(true)

      // Load conversation
      const { data: conversationData } = await supabase
        .from('conversations')
        .select('*')
        .eq('contact_id', contact.id)
        .eq('processed', true)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single()

      if (conversationData) {
        setConversation(conversationData)
      }

      // Load AI actions
      const { data: actionsData } = await supabase
        .from('ai_actions')
        .select('*')
        .eq('contact_id', contact.id)
        .order('created_at', { ascending: false })

      if (actionsData) {
        setAiActions(actionsData)
      }
    } catch (error) {
      console.error('Error loading conversation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendConnectionRequest = async () => {
    try {
      // Call background script to send connection request
      const backgroundService = (self as any).backgroundService
      if (backgroundService) {
        await backgroundService.sendConnectionRequest(contact.id)
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
    }
  }

  const openLinkedInProfile = () => {
    chrome.tabs.create({ url: contact.linkedin_url })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">{contact.name}</h2>
            {contact.linkedin_profile_data?.title && (
              <p className="text-sm text-gray-600 truncate">
                {contact.linkedin_profile_data.title}
                {contact.linkedin_profile_data.company && 
                  ` at ${contact.linkedin_profile_data.company}`
                }
              </p>
            )}
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={openLinkedInProfile}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-linkedin-600 text-white rounded-lg hover:bg-linkedin-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Profile
          </button>
          
          {contact.status === 'not_contacted' && (
            <button
              onClick={handleSendConnectionRequest}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showSettings ? (
          <div className="p-4 space-y-6">
            <AutoPilotToggle
              contact={contact}
              onUpdate={onContactUpdate}
            />
            <RelationshipSettings
              contact={contact}
              onUpdate={onContactUpdate}
            />
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Conversation Summary */}
            {conversation ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-linkedin-600" />
                  <h3 className="font-medium text-gray-900">Conversation Summary</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(conversation.recorded_at).toLocaleDateString()}
                  </div>
                  
                  {conversation.summary && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {conversation.summary}
                    </p>
                  )}
                  
                  {conversation.key_topics && conversation.key_topics.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Key Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {conversation.key_topics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-linkedin-100 text-linkedin-700 rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No conversation recorded yet</p>
              </div>
            )}

            {/* AI Actions Log */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
              {aiActions.length > 0 ? (
                <div className="space-y-2">
                  {aiActions.slice(0, 5).map((action) => (
                    <div key={action.id} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {action.action_type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(action.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {action.action_content && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {action.action_content}
                        </p>
                      )}
                      <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${
                        action.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          action.success ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {action.success ? 'Success' : 'Failed'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">No activity yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}