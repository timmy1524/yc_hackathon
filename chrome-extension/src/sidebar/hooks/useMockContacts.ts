import { useState } from 'react'
import { Contact } from '@/types'

// Mock data for development
const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Sarah Johnson',
    linkedin_url: 'https://www.linkedin.com/in/sarah-johnson/',
    linkedin_profile_data: {
      title: 'Senior Product Manager',
      company: 'TechCorp Inc',
      location: 'San Francisco, CA'
    },
    relationship_type: 'potential_client',
    custom_instructions: 'Keep responses professional and mention our AI solutions',
    auto_pilot_enabled: true,
    status: 'connected',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Mike Chen',
    linkedin_url: 'https://www.linkedin.com/in/mike-chen/',
    linkedin_profile_data: {
      title: 'Engineering Manager',
      company: 'StartupXYZ',
      location: 'New York, NY'
    },
    relationship_type: 'professional_contact',
    custom_instructions: null,
    auto_pilot_enabled: false,
    status: 'connection_sent',
    created_at: '2024-01-16T14:20:00Z',
    updated_at: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    user_id: 'user-1',
    name: 'Emily Rodriguez',
    linkedin_url: 'https://www.linkedin.com/in/emily-rodriguez/',
    linkedin_profile_data: {
      title: 'VP of Sales',
      company: 'SalesForce Solutions',
      location: 'Austin, TX'
    },
    relationship_type: 'potential_client',
    custom_instructions: 'Focus on ROI and business impact',
    auto_pilot_enabled: true,
    status: 'not_contacted',
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    user_id: 'user-1',
    name: 'David Kumar',
    linkedin_url: 'https://www.linkedin.com/in/david-kumar/',
    linkedin_profile_data: {
      title: 'CTO',
      company: 'InnovateNow',
      location: 'Seattle, WA'
    },
    relationship_type: 'colleague',
    custom_instructions: 'Be casual and mention our shared interests in AI',
    auto_pilot_enabled: false,
    status: 'connected',
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z'
  }
]

export function useMockContacts() {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS)
  const [loading, setLoading] = useState(false)
  const [error] = useState<string | null>(null)

  const updateContact = async (contactId: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact =>
      contact.id === contactId ? { ...contact, ...updates } : contact
    ))
  }

  const refetch = async () => {
    setLoading(true)
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  return {
    contacts,
    loading,
    error,
    refetch,
    updateContact
  }
}