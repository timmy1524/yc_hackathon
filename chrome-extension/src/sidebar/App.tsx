import { useState } from 'react'
import { useSupabase } from './hooks/useSupabase'
import { useContacts } from './hooks/useContacts'
import { Contact } from '@/types'
import ContactList from './components/ContactList'
import ContactDetail from './components/ContactDetail'
import LoginPrompt from './components/LoginPrompt'

export default function App() {
  const { user, loading: authLoading } = useSupabase()
  const { contacts, loading: contactsLoading, updateContact } = useContacts()
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  if (authLoading) {
    return (
      <div className="w-96 h-96 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-linkedin-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPrompt />
  }

  return (
    <div className="w-96 h-96 bg-white flex flex-col">
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
  )
}