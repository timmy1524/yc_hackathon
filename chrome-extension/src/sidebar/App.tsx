import { useState, useMemo } from 'react'
import { useMockAuth } from './hooks/useMockAuth'
import { useContacts } from './hooks/useContacts'
import { Contact } from '@/types'
import LoginPrompt from './components/LoginPrompt'

export default function App() {
  const { user, loading: authLoading } = useMockAuth()
  const { contacts, loading: contactsLoading, error: contactsError } = useContacts()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(query) ||
        contact.relationship_type.toLowerCase().includes(query) ||
        contact.created_at.includes(query)
      )
    }

    // Sort by connection date (latest first)
    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [contacts, searchQuery])

  const handleContactClick = (contact: Contact) => {
    // Open LinkedIn profile in new tab
    window.open(contact.linkedin_url, '_blank')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

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

  return (
    <div className="w-96 h-[600px] bg-white flex flex-col">
      {/* Header with Search Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          👤 Recent Connections
        </h1>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, event type, or date..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contact Cards List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {contactsLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : contactsError ? (
          <div className="text-center p-8">
            <div className="text-red-600 font-medium mb-2">Error loading contacts</div>
            <div className="text-sm text-gray-600 mb-4">{contactsError}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : filteredAndSortedContacts.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {searchQuery ? 'No contacts found' : 'No contacts yet'}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredAndSortedContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {contact.name}
                  </h3>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {formatDate(contact.created_at)}
                  </div>
                </div>
                <p className="text-sm text-blue-600 font-medium">
                  Event Type: <span className="capitalize text-gray-700">
                    {contact.relationship_type.replace('_', ' ')}
                  </span>
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  Click to view LinkedIn profile
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}