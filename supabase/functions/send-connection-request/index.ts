import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'
import { OpenAIClient } from '../_shared/openai.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contactId, userId } = await req.json()

    if (!contactId || !userId) {
      throw new Error('Missing required parameters')
    }

    // 1. Get contact and conversation data
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single()

    if (contactError || !contact) {
      throw new Error('Contact not found')
    }

    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('key_topics, recorded_at')
      .eq('contact_id', contactId)
      .eq('processed', true)
      .order('recorded_at', { ascending: false })
      .limit(1)

    if (conversationsError) {
      throw conversationsError
    }

    const conversation = conversations?.[0]
    const topics = conversation?.key_topics?.join(', ') || 'our conversation'
    const meetDate = conversation?.recorded_at ? new Date(conversation.recorded_at).toLocaleDateString() : 'recently'

    // 2. Build GPT-4 prompt
    const prompt = `
Generate a personalized LinkedIn connection request message.
Maximum 300 characters (LinkedIn limit).

Context:
- Met: ${meetDate}
- Discussed: ${topics}
- Their role: ${contact.linkedin_profile_data.title || 'Professional'} at ${contact.linkedin_profile_data.company || 'their company'}

Be warm, professional, and reference the conversation naturally.
`

    const openai = new OpenAIClient()
    const result = await openai.generateCompletion(prompt, 100)

    // Ensure under 300 characters
    let connectionMessage = result.text.trim()
    if (connectionMessage.length > 300) {
      connectionMessage = connectionMessage.substring(0, 297) + '...'
    }

    // 3. Log the action
    const { error: actionError } = await supabase
      .from('ai_actions')
      .insert({
        user_id: userId,
        contact_id: contactId,
        action_type: 'connection_request',
        action_content: connectionMessage,
        success: true,
        metadata: {
          topics,
          meet_date: meetDate
        }
      })

    if (actionError) {
      throw actionError
    }

    return new Response(
      JSON.stringify({
        connectionMessage,
        success: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})