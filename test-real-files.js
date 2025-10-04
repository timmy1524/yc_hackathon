// Test with real files: tim.jpeg, tim.mp3, and LinkedIn profile
const fs = require('fs');

async function testRealFiles() {
  try {
    console.log('🎵 Testing with real files: tim.jpeg, tim.mp3...')
    
    // Check if files exist
    const audioFile = '/Users/fanzhao/projects/yc_hackathon/tim.MP3'
    const imageFile = '/Users/fanzhao/projects/yc_hackathon/tim.jpeg'
    
    if (!fs.existsSync(audioFile)) {
      console.error('❌ Audio file not found:', audioFile)
      return
    }
    
    if (!fs.existsSync(imageFile)) {
      console.error('❌ Image file not found:', imageFile)
      return
    }
    
    // Read and encode files
    const audioBuffer = fs.readFileSync(audioFile)
    const audioBase64 = audioBuffer.toString('base64')
    
    const imageBuffer = fs.readFileSync(imageFile)
    const imageBase64 = imageBuffer.toString('base64')
    
    console.log('📁 File details:')
    console.log(`  - Audio file size: ${audioBuffer.length} bytes`)
    console.log(`  - Image file size: ${imageBuffer.length} bytes`)
    console.log(`  - Audio base64 length: ${audioBase64.length} characters`)
    console.log(`  - Image base64 length: ${imageBase64.length} characters`)
    
    // Create request body with real data
    const requestBody = {
      user_name: 'Test User',
      user_email: 'test@example.com',
      audio_file: audioBase64,
      profile_url: 'https://www.linkedin.com/in/tim-p-962859221/',
      profile_name: 'Tim P',
      profile_image: imageBase64
    }
    
    console.log('📦 Request details:')
    console.log(`  - Profile URL: ${requestBody.profile_url}`)
    console.log(`  - Profile Name: ${requestBody.profile_name}`)
    console.log(`  - Audio file: ${requestBody.audio_file.length} characters`)
    console.log(`  - Profile image: ${requestBody.profile_image.length} characters`)
    
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
    console.error('❌ Test failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

testRealFiles()
