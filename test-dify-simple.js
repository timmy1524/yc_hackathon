// Simple test for processAudioWithDify function
// This test simulates the function call without actually running it

const fs = require('fs');
const path = require('path');

async function testProcessAudioWithDify() {
  try {
    console.log('🎵 Testing processAudioWithDify function...')
    
    // Read the audio file
    const audioFilePath = '/Users/fanzhao/projects/yc_hackathon/New Recording 3.m4a'
    
    if (!fs.existsSync(audioFilePath)) {
      console.error('❌ Audio file not found:', audioFilePath)
      return
    }
    
    const audioStats = fs.statSync(audioFilePath)
    console.log(`📁 Audio file size: ${audioStats.size} bytes`)
    console.log(`📁 Audio file exists: ✅`)
    
    // Create a simple 1x1 pixel PNG image (base64 encoded)
    const emptyImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    // Test parameters
    const profileName = 'Test User'
    const profileUrl = 'https://www.linkedin.com/in/test-user'
    const profileImage = emptyImageBase64
    
    console.log('📝 Test Parameters:')
    console.log(`  - Profile: ${profileName}`)
    console.log(`  - URL: ${profileUrl}`)
    console.log(`  - Image: ${profileImage.substring(0, 50)}...`)
    
    // Read audio file as base64
    const audioBuffer = fs.readFileSync(audioFilePath)
    const audioBase64 = audioBuffer.toString('base64')
    
    console.log('📊 Audio file converted to base64:')
    console.log(`  - Base64 length: ${audioBase64.length} characters`)
    console.log(`  - Base64 preview: ${audioBase64.substring(0, 100)}...`)
    
    // Create test request body
    const testRequestBody = {
      user_name: 'Test User',
      user_email: 'test@example.com',
      audio_file: audioBase64,
      profile_url: profileUrl,
      profile_name: profileName,
      profile_image: profileImage
    }
    
    console.log('📦 Test request body created:')
    console.log(`  - user_name: ${testRequestBody.user_name}`)
    console.log(`  - user_email: ${testRequestBody.user_email}`)
    console.log(`  - audio_file length: ${testRequestBody.audio_file.length}`)
    console.log(`  - profile_url: ${testRequestBody.profile_url}`)
    console.log(`  - profile_name: ${testRequestBody.profile_name}`)
    console.log(`  - profile_image length: ${testRequestBody.profile_image.length}`)
    
    console.log('✅ Test setup completed successfully!')
    console.log('🚀 Ready to test with actual Supabase function call')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    console.error('Stack trace:', error.stack)
  }
}

// Run the test
testProcessAudioWithDify()
