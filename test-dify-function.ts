import { processAudioWithDify } from './supabase/functions/_shared/dify.ts'

async function testProcessAudioWithDify() {
  try {
    console.log('🎵 Testing processAudioWithDify function...')
    
    // Read the audio file
    const audioFilePath = '/Users/fanzhao/projects/yc_hackathon/New Recording 3.m4a'
    const audioFile = await Deno.readFile(audioFilePath)
    console.log(`📁 Audio file size: ${audioFile.length} bytes`)
    
    // Create a simple 1x1 pixel PNG image (base64 encoded)
    const emptyImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    // Test parameters
    const profileName = 'Test User'
    const profileUrl = 'https://www.linkedin.com/in/test-user'
    const profileImage = emptyImageBase64
    
    console.log('🚀 Calling processAudioWithDify...')
    console.log(`📝 Profile: ${profileName}`)
    console.log(`🔗 URL: ${profileUrl}`)
    console.log(`🖼️ Image: ${profileImage.substring(0, 50)}...`)
    
    // Call the function
    const result = await processAudioWithDify(
      audioFile.buffer,
      profileName,
      profileUrl,
      profileImage
    )
    
    console.log('✅ Function completed successfully!')
    console.log('📊 Results:')
    console.log(`  - Conversation Summary: ${result.conversation_summary}`)
    console.log(`  - Follow-up Text: ${result.follow_up_text}`)
    console.log(`  - Date Met: ${result.date_met}`)
    console.log(`  - Meeting Event: ${result.meeting_event}`)
    console.log(`  - Future Potential: ${result.future_potential}`)
    console.log(`  - Follow-up Priority: ${result.follow_up_priority}`)
    console.log(`  - Follow-up Suggestion: ${result.follow_up_suggestion}`)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    console.error('Stack trace:', error.stack)
  }
}

// Run the test
if (import.meta.main) {
  await testProcessAudioWithDify()
}
