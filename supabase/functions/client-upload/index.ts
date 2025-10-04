import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'
import { processAudioWithLLM } from '../_shared/openai.ts'
import { UploadRequest, ApiResponse, User, Contact } from '../_shared/types.ts'

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: UploadRequest = await req.json()
    const { user_name, user_email, audio_file, profile_url, profile_name } = body

    // Validate required fields
    if (!user_name || !user_email || !audio_file || !profile_url || !profile_name) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Missing required fields: user_name, user_email, audio_file, profile_url, profile_name' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get or create user
    let user: User
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_email', user_email)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      throw userError
    }

    if (existingUser) {
      user = existingUser
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          user_name,
          user_email,
        })
        .select()
        .single()

      if (createError) throw createError
      user = newUser
    }

    // Process audio with LLM
    const llmResponse = await processAudioWithLLM(audio_file, profile_name, profile_url)

    // Check if contact already exists
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('profile_url', profile_url)
      .single()

    let contact: Contact

    if (existingContact) {
      // Update existing contact
      const { data: updatedContact, error: updateError } = await supabase
        .from('contacts')
        .update({
          name: profile_name,
          conversation_summary: llmResponse.conversation_summary,
          follow_up_actions: llmResponse.follow_up_actions,
          follow_up_suggestions: llmResponse.follow_up_suggestions,
          follow_up_text: llmResponse.follow_up_text,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingContact.id)
        .select()
        .single()

      if (updateError) throw updateError
      contact = updatedContact
    } else {
      // Create new contact
      const { data: newContact, error: createError } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          name: profile_name,
          profile_url,
          conversation_summary: llmResponse.conversation_summary,
          follow_up_actions: llmResponse.follow_up_actions,
          follow_up_suggestions: llmResponse.follow_up_suggestions,
          follow_up_text: llmResponse.follow_up_text,
        })
        .select()
        .single()

      if (createError) throw createError
      contact = newContact
    }

    const response: ApiResponse = {
      status: 'success',
      message: 'Audio uploaded successfully',
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing upload:', error)
    
    const response: ApiResponse = {
      status: 'error',
      message: 'Audio upload failed',
    }

    return new Response(
      JSON.stringify(response),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
