// Test without profile image to see if the issue is with the image upload
const fs = require('fs');

async function testNoImage() {
  try {
    console.log('🎵 Testing without profile image...')
    
    // Test with minimal data and no profile image
    const requestBody = {
      user_name: 'Test',
      user_email: 'test@test.com',
      audio_file: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=',
      profile_url: 'https://linkedin.com/in/test',
      profile_name: 'Test User'
      // No profile_image field
    }
    
    console.log('📦 Request without profile image:')
    console.log(`  - Audio file size: ${requestBody.audio_file.length} characters`)
    console.log(`  - No profile image provided`)
    
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
    console.error('❌ Test failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

testNoImage()
