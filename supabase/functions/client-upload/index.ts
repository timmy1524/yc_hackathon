import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase } from '../_shared/supabase.ts'
import { processAudioWithDify } from '../_shared/dify.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { UploadRequest, UploadResponse } from '../_shared/types.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const body: UploadRequest = await req.json()
    const { user_name, user_email, audio_file, profile_url, profile_name, profile_image } = body

    // Basic field check (simplified)
    if (!audio_file) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Audio file required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Convert base64 audio to ArrayBuffer
    const audioBuffer = Uint8Array.from(atob(audio_file), c => c.charCodeAt(0)).buffer

    // Process audio with Dify - handles transcription and analysis in one call
    console.log('Processing audio with Dify...')
    const analysis = await processAudioWithDify(audioBuffer, profile_name, profile_url, profile_image)
    console.log('Dify processing completed:', analysis)

    // Store in database
    const { error } = await supabase
      .from('conversations')
      .insert({
        user_name,
        user_email,
        profile_name,
        profile_url,
        conversation_summary: analysis.conversation_summary,
        follow_up_text: analysis.follow_up_text,
        date_met: analysis.date_met,
        meeting_event: analysis.meeting_event,
        future_potential: analysis.future_potential,
        follow_up_priority: analysis.follow_up_priority,
        follow_up_suggestion: analysis.follow_up_suggestion,
      })

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Failed to save conversation data' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const response: UploadResponse = {
      status: 'success',
      message: 'Audio uploaded successfully'
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Upload error:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Audio upload failed',
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
