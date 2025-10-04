// Test with a smaller audio file to debug the issue
const fs = require('fs');

async function testSmallAudio() {
  try {
    console.log('🎵 Testing with smaller audio file...')
    
    // Create a small test audio file (1 second of silence)
    // This is a minimal WAV file with 1 second of silence
    const smallAudioBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='
    
    // Create a simple 1x1 pixel PNG image (base64 encoded)
    const emptyImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    // Test request body
    const requestBody = {
      user_name: 'Test User',
      user_email: 'test@example.com',
      audio_file: smallAudioBase64,
      profile_url: 'https://www.linkedin.com/in/test-user',
      profile_name: 'Test User',
      profile_image: emptyImageBase64
    }
    
    console.log('📦 Small test request:')
    console.log(`  - Audio file size: ${smallAudioBase64.length} characters`)
    console.log(`  - Profile image: ${emptyImageBase64.length} characters`)
    
    // Call the deployed function
    const functionUrl = 'https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload'
    
    console.log('🚀 Calling deployed function...')
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log(`📊 Response status: ${response.status}`)
    
    const responseText = await response.text()
    console.log('📄 Response body:')
    console.log(responseText)
    
    if (response.ok) {
      console.log('✅ Function call successful!')
    } else {
      console.log('❌ Function call failed')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    console.error('Stack trace:', error.stack)
  }
}

// Run the test
testSmallAudio()
