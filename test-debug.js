// Debug test to see what's happening in the function
const fs = require('fs');

async function testDebug() {
  try {
    console.log('🔍 Debug test for client-upload function...')
    
    // Test with minimal data
    const requestBody = {
      user_name: 'Test',
      user_email: 'test@test.com',
      audio_file: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=', // 1 second silence
      profile_url: 'https://linkedin.com/in/test',
      profile_name: 'Test User',
      profile_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    }
    
    console.log('📦 Request body created')
    console.log('🚀 Making request...')
    
    const functionUrl = 'https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload'
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log(`📊 Status: ${response.status}`)
    console.log(`📊 Status Text: ${response.statusText}`)
    
    const responseText = await response.text()
    console.log('📄 Full Response:')
    console.log(responseText)
    
    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(responseText)
      console.log('📋 Parsed JSON:')
      console.log(JSON.stringify(jsonResponse, null, 2))
    } catch (parseError) {
      console.log('⚠️ Response is not valid JSON')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

testDebug()
