import { useState } from 'react'
// import { useSupabase } from './hooks/useSupabase'
// import { useContacts } from './hooks/useContacts'
import { useMockAuth } from './hooks/useMockAuth'
import { useMockContacts } from './hooks/useMockContacts'
import { Contact } from '@/types'
import ContactList from './components/ContactList'
import ContactDetail from './components/ContactDetail'
import LoginPrompt from './components/LoginPrompt'

export default function App() {
  // Using mock data for development - replace with real hooks when backend is ready
  const { user, loading: authLoading } = useMockAuth()
  const { contacts, loading: contactsLoading, updateContact } = useMockContacts()
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [chatMessage, setChatMessage] = useState('')

  if (authLoading) {
    return (
      <div className="w-96 h-[600px] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPrompt />
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage)
      setChatMessage('')
    }
  }

  return (
    <div className="w-96 h-[600px] bg-white flex flex-col">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          Welcome 👋
        </h1>
        <p className="text-sm text-gray-600 mt-1">LinkedIn AI Assistant</p>
      </div>

      {/* Tools Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700">Tools</h2>
          <button className="text-xs text-blue-600 hover:text-blue-800">More ›</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
              <span className="text-blue-600 text-sm">👥</span>
            </div>
            <span className="text-xs text-gray-600">Contacts</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-1">
              <span className="text-green-600 text-sm">🤖</span>
            </div>
            <span className="text-xs text-gray-600">AI Chat</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
              <span className="text-purple-600 text-sm">✍️</span>
            </div>
            <span className="text-xs text-gray-600">Write</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-1">
              <span className="text-orange-600 text-sm">📊</span>
            </div>
            <span className="text-xs text-gray-600">Analytics</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {selectedContact ? (
          <ContactDetail
            contact={selectedContact}
            onBack={() => setSelectedContact(null)}
            onContactUpdate={updateContact}
          />
        ) : (
          <ContactList
            contacts={contacts}
            loading={contactsLoading}
            onContactSelect={setSelectedContact}
          />
        )}
      </div>

      {/* Chat Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AI about LinkedIn..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!chatMessage.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}