// Test Dify API directly to see if it's accessible
async function testDifyDirect() {
  try {
    console.log('🔍 Testing Dify API directly...')
    
    const DIFY_BASE_URL = 'http://20.119.99.119/v1'
    const DIFY_API_KEY = 'app-DvILfF25wV9hGW0MzLtkVOdr'
    
    console.log(`📍 Dify Base URL: ${DIFY_BASE_URL}`)
    console.log(`🔑 API Key: ${DIFY_API_KEY.substring(0, 20)}...`)
    
    // Test 1: Try to upload a small file
    console.log('📤 Testing file upload...')
    
    const smallAudioBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='
    const audioBuffer = Buffer.from(smallAudioBase64, 'base64')
    
    const formData = new FormData()
    formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'test.wav')
    formData.append('user', 'test-user')
    
    const uploadResponse = await fetch(`${DIFY_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
      },
      body: formData
    })
    
    console.log(`📊 Upload response status: ${uploadResponse.status}`)
    console.log(`📊 Upload response headers:`, Object.fromEntries(uploadResponse.headers.entries()))
    
    const uploadText = await uploadResponse.text()
    console.log('📄 Upload response:')
    console.log(uploadText)
    
    if (uploadResponse.ok) {
      console.log('✅ File upload successful!')
      
      try {
        const uploadResult = JSON.parse(uploadText)
        const fileId = uploadResult.id
        console.log(`📁 File ID: ${fileId}`)
        
        // Test 2: Try to run workflow
        console.log('🔄 Testing workflow execution...')
        
        const workflowResponse = await fetch(`${DIFY_BASE_URL}/workflows/run`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DIFY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {
              audio_file: [{
                transfer_method: 'local_file',
                upload_file_id: fileId,
                type: 'audio'
              }],
              profile_name: 'Test User',
              profile_url: 'https://linkedin.com/in/test'
            },
            response_mode: 'blocking',
            user: 'test-user'
          })
        })
        
        console.log(`📊 Workflow response status: ${workflowResponse.status}`)
        const workflowText = await workflowResponse.text()
        console.log('📄 Workflow response:')
        console.log(workflowText)
        
      } catch (parseError) {
        console.log('⚠️ Could not parse upload response as JSON')
      }
      
    } else {
      console.log('❌ File upload failed')
      console.log('This suggests the Dify API is not accessible or credentials are wrong')
    }
    
  } catch (error) {
    console.error('❌ Dify test failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

testDifyDirect()
