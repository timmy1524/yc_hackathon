import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'
import { OpenAIClient } from '../_shared/openai.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contactId, incomingMessage, userId } = await req.json()

    if (!contactId || !incomingMessage || !userId) {
      throw new Error('Missing required parameters')
    }

    // 1. Get contact info
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single()

    if (contactError || !contact) {
      throw new Error('Contact not found')
    }

    // 2. Get recent message history
    const { data: messages, error: messagesError } = await supabase
      .from('linkedin_messages')
      .select('*')
      .eq('contact_id', contactId)
      .order('sent_at', { ascending: false })
      .limit(10)

    if (messagesError) {
      throw messagesError
    }

    // 3. Get conversation summary
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('summary')
      .eq('contact_id', contactId)
      .eq('processed', true)
      .order('recorded_at', { ascending: false })
      .limit(1)

    if (conversationsError) {
      throw conversationsError
    }

    const conversationSummary = conversations?.[0]?.summary || 'No previous conversation recorded'

    // 4. Build GPT-4 prompt
    const recentMessages = messages?.map(m => `${m.sender}: ${m.message_text}`).join('\n') || 'No previous messages'

    const prompt = `
You are helping respond to a LinkedIn message professionally.

Context:
- Relationship: ${contact.relationship_type}
- Conversation Summary: ${conversationSummary}
- Recent Messages: ${recentMessages}
- Custom Instructions: ${contact.custom_instructions || 'None'}

They just sent: "${incomingMessage}"

Generate a natural, professional response (under 200 words).
Match their tone and reference relevant context from your conversation.
`

    const openai = new OpenAIClient()
    const result = await openai.generateCompletion(prompt, 300)

    // 5. Log the action
    const { error: actionError } = await supabase
      .from('ai_actions')
      .insert({
        user_id: userId,
        contact_id: contactId,
        action_type: 'message_sent',
        action_content: result.text,
        success: true,
        metadata: {
          incoming_message: incomingMessage,
          tokens_used: result.usage.total_tokens
        }
      })

    if (actionError) {
      throw actionError
    }

    // 6. Save messages to history
    await supabase.from('linkedin_messages').insert([
      {
        user_id: userId,
        contact_id: contactId,
        sender: 'contact',
        message_text: incomingMessage,
        ai_generated: false
      },
      {
        user_id: userId,
        contact_id: contactId,
        sender: 'user',
        message_text: result.text,
        ai_generated: true
      }
    ])

    return new Response(
      JSON.stringify({
        generatedMessage: result.text,
        metadata: {
          model: 'gpt-4',
          tokens_used: result.usage.total_tokens,
          generation_time_ms: 0 // Would need to track this
        }
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