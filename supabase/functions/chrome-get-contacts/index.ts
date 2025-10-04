import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'
import { GetContactsRequest, ApiResponse, Contact } from '../_shared/types.ts'

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const user_name = url.searchParams.get('user_name')
    const user_email = url.searchParams.get('user_email')

    // Validate required fields
    if (!user_name || !user_email) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Missing required parameters: user_name, user_email' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('user_email', user_email)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'User not found' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's contacts
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (contactsError) {
      throw contactsError
    }

    const response: ApiResponse<{ contacts: Contact[] }> = {
      status: 'success',
      message: 'Contacts fetched successfully',
      data: { contacts: contacts || [] }
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching contacts:', error)
    
    const response: ApiResponse = {
      status: 'error',
      message: 'Contacts fetch failed',
    }

    return new Response(
      JSON.stringify(response),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
