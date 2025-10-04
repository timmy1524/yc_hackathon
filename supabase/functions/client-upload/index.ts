import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase } from '../_shared/supabase.ts'
import { processAudioWithDify } from '../_shared/dify.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { UploadRequest, UploadResponse } from '../_shared/types.ts'
import { sendEmail, createProcessingCompleteEmail } from '../_shared/simple-resend.ts'

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
    const { audio_file, profile_url, profile_name, profile_image } = body
    
    // Hardcoded user information
    const user_name = 'Yilun'
    const user_email = 'yilunsun@gmail.com'

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

    // Log that processing is starting
    console.log('Starting audio processing for user:', user_name, 'profile:', profile_name)

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

    // Send email notification with conversation summary after processing is complete
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 20px auto; padding: 20px; background: white; border-radius: 8px; }
              .header { background: #0a66c2; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { padding: 20px; }
              .summary-box { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #0a66c2; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 New Connection Made!</h1>
              </div>
              <div class="content">
                <p>Hi ${user_name},</p>
                <p>Great news! Your conversation with <strong>${profile_name}</strong> has been processed successfully!</p>
                
                <div class="summary-box">
                  <h3>💬 Conversation Summary:</h3>
                  <p>${analysis.conversation_summary || 'Summary will be available shortly.'}</p>
                </div>

                <p><strong>Connection Details:</strong></p>
                <ul>
                  <li><strong>Name:</strong> ${profile_name || 'Unknown'}</li>
                  <li><strong>LinkedIn:</strong> <a href="${profile_url}" target="_blank">${profile_url}</a></li>
                  <li><strong>Date:</strong> ${analysis.date_met || new Date().toISOString().split('T')[0]}</li>
                  <li><strong>Event:</strong> ${analysis.meeting_event || 'Networking'}</li>
                  <li><strong>Priority:</strong> ${analysis.follow_up_priority || 'Medium'}</li>
                </ul>

                ${analysis.follow_up_suggestion ? `
                <div class="summary-box">
                  <h3>💡 Follow-up Suggestion:</h3>
                  <p>${analysis.follow_up_suggestion}</p>
                </div>
                ` : ''}

                <p>Keep building those connections! 🚀</p>
              </div>
            </div>
          </body>
        </html>
      `

      await sendEmail({
        to: 'verandafeng@gmail.com',
        subject: `🎉 Congrats you made a new connection with ${profile_name}`,
        html: emailHtml,
      })
      console.log('Email notification sent successfully to: verandafeng@gmail.com')
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
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
