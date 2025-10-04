// Test the deployed client-upload function with real audio file
const fs = require('fs');

async function testClientUpload() {
  try {
    console.log('🎵 Testing client-upload function with real audio...')
    
    // Read the audio file
    const audioFilePath = '/Users/fanzhao/projects/yc_hackathon/New Recording 3.m4a'
    
    if (!fs.existsSync(audioFilePath)) {
      console.error('❌ Audio file not found:', audioFilePath)
      return
    }
    
    const audioBuffer = fs.readFileSync(audioFilePath)
    const audioBase64 = audioBuffer.toString('base64')
    
    // Create a simple 1x1 pixel PNG image (base64 encoded)
    const emptyImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    // Test request body
    const requestBody = {
      user_name: 'Test User',
      user_email: 'test@example.com',
      audio_file: audioBase64,
      profile_url: 'https://www.linkedin.com/in/test-user',
      profile_name: 'Test User',
      profile_image: emptyImageBase64
    }
    
    console.log('📦 Request details:')
    console.log(`  - Audio file size: ${audioBuffer.length} bytes`)
    console.log(`  - Base64 length: ${audioBase64.length} characters`)
    console.log(`  - Profile image: ${emptyImageBase64.length} characters`)
    
    // Call the deployed function
    const functionUrl = 'https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload'
    
    console.log('🚀 Calling deployed function...')
    console.log(`📍 URL: ${functionUrl}`)
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log(`📊 Response status: ${response.status}`)
    console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('📄 Response body:')
    console.log(responseText)
    
    if (response.ok) {
      console.log('✅ Function call successful!')
      try {
        const responseJson = JSON.parse(responseText)
        console.log('📋 Parsed response:')
        console.log(JSON.stringify(responseJson, null, 2))
      } catch (parseError) {
        console.log('⚠️ Response is not valid JSON')
      }
    } else {
      console.log('❌ Function call failed')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    console.error('Stack trace:', error.stack)
  }
}

// Run the test
testClientUpload()
