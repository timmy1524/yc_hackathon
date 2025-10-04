import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Contact, Conversation, ProcessAudioResponse } from '@/types'

export function useSupabase() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createContact = async (contactData: {
    name: string
    linkedin_url: string
    linkedin_profile_data?: any
  }): Promise<Contact | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert(contactData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async (conversationData: {
    contact_id: string
    duration_seconds: number
  }): Promise<Conversation | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const uploadAudio = async (audioBlob: Blob, fileName: string): Promise<string | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.storage
        .from('audio-recordings')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('audio-recordings')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const processAudio = async (audioUrl: string, contactId: string, conversationId: string): Promise<ProcessAudioResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('process-audio', {
        body: {
          audioUrl,
          contactId,
          conversationId,
          userId: (await supabase.auth.getUser()).data.user?.id,
        },
      })

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getConversation = async (conversationId: string): Promise<Conversation | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createContact,
    createConversation,
    uploadAudio,
    processAudio,
    getConversation,
  }
}