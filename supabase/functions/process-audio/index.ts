import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'
import { OpenAIClient } from '../_shared/openai.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audioUrl, contactId, conversationId, userId } = await req.json()

    if (!audioUrl || !contactId || !conversationId || !userId) {
      throw new Error('Missing required parameters')
    }

    const openai = new OpenAIClient()

    // 1. Download and transcribe audio
    const transcription = await openai.transcribeAudio(audioUrl)

    // 2. Analyze conversation with GPT-4
    const analysisPrompt = `
Analyze this business conversation and extract:
- A concise summary (2-3 sentences)
- Key topics discussed (array of strings)
- Suggested relationship type (potential_client, professional_contact, friend, colleague)
- Action items or follow-ups needed
- Overall sentiment (positive, neutral, negative)

Return response as JSON.

Conversation:
${transcription}
`

    const analysisResult = await openai.generateCompletion(analysisPrompt, 500)
    const analysis = JSON.parse(analysisResult.text)

    // 3. Update conversation record
    const { error: conversationError } = await supabase
      .from('conversations')
      .update({
        transcription,
        summary: analysis.summary,
        key_topics: analysis.key_topics,
        ai_analysis: {
          sentiment: analysis.sentiment,
          action_items: analysis.action_items
        },
        processed: true
      })
      .eq('id', conversationId)

    if (conversationError) {
      throw conversationError
    }

    // 4. Update contact with suggested relationship type
    const { error: contactError } = await supabase
      .from('contacts')
      .update({
        relationship_type: analysis.suggested_relationship
      })
      .eq('id', contactId)

    if (contactError) {
      throw contactError
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          transcription,
          summary: analysis.summary,
          key_topics: analysis.key_topics,
          suggested_relationship: analysis.suggested_relationship,
          action_items: analysis.action_items,
          sentiment: analysis.sentiment
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