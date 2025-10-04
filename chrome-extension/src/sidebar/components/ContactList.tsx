import { useState } from 'react'
import { Search, Filter, Users } from 'lucide-react'
import { Contact } from '@/types'
import ContactCard from './ContactCard'

interface ContactListProps {
  contacts: Contact[]
  loading: boolean
  onContactSelect: (contact: Contact) => void
}

type FilterType = 'all' | 'new' | 'connected'

export default function ContactList({ contacts, loading, onContactSelect }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.linkedin_profile_data?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.linkedin_profile_data?.company?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filter === 'all' || 
                         (filter === 'new' && contact.status === 'not_contacted') ||
                         (filter === 'connected' && contact.status === 'connected')

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-linkedin-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-gray-500 mt-2">Loading contacts...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-linkedin-600" />
          <h1 className="font-semibold text-gray-900">Contacts</h1>
          <span className="text-sm text-gray-500">({contacts.length})</span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-600 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'new', label: 'New' },
            { key: 'connected', label: 'Connected' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as FilterType)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                filter === key
                  ? 'bg-linkedin-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {searchTerm || filter !== 'all' ? 'No contacts match your filters' : 'No contacts yet'}
            </p>
            {!searchTerm && filter === 'all' && (
              <p className="text-xs text-gray-400 mt-1">
                Record conversations in the mobile app to see contacts here
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onClick={() => onContactSelect(contact)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}