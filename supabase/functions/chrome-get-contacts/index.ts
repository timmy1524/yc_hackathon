import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase } from '../_shared/supabase.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { GetContactsRequest, GetContactsResponse, Contact } from '../_shared/types.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse query parameters
    const url = new URL(req.url)
    const user_name = url.searchParams.get('user_name')
    const user_email = url.searchParams.get('user_email')

    // Validate required fields
    if (!user_name || !user_email) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Missing required parameters: user_name and user_email' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch user's conversations from database
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_email', user_email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Contacts fetch failed' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Transform conversations to contacts format
    const contacts: Contact[] = conversations.map(conv => ({
      name: conv.profile_name,
      profile_url: conv.profile_url,
      conversation_summary: conv.conversation_summary || '',
      follow_up_text: conv.follow_up_text || '',
      date_met: conv.date_met,
      meeting_event: conv.meeting_event,
      future_potential: conv.future_potential,
      follow_up_priority: conv.follow_up_priority,
      follow_up_suggestion: conv.follow_up_suggestion
    }))

    const response: GetContactsResponse = {
      status: 'success',
      message: 'Contacts fetched successfully',
      contacts
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Get contacts error:', error)
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: 'Contacts fetch failed' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
