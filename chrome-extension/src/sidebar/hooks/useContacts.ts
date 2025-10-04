import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Contact } from '@/types'

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadContacts()
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('contacts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contacts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setContacts(prev => [payload.new as Contact, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setContacts(prev => prev.map(contact => 
              contact.id === payload.new.id ? payload.new as Contact : contact
            ))
          } else if (payload.eventType === 'DELETE') {
            setContacts(prev => prev.filter(contact => contact.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Please sign in to view contacts')
        return
      }

      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setContacts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const updateContact = async (contactId: string, updates: Partial<Contact>) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', contactId)

      if (error) throw error

      // Update local state
      setContacts(prev => prev.map(contact =>
        contact.id === contactId ? { ...contact, ...updates } : contact
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact')
    }
  }

  return {
    contacts,
    loading,
    error,
    refetch: loadContacts,
    updateContact
  }
}