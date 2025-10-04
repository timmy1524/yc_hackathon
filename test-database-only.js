// Test to see if the issue is with database or Dify
const fs = require('fs');

async function testDatabaseOnly() {
  try {
    console.log('🗄️ Testing database connection only...')
    
    // Test the chrome-get-contacts endpoint first to see if database works
    const contactsUrl = 'https://shktirpoweaqcvvleldo.supabase.co/functions/v1/chrome-get-contacts?user_name=Test&user_email=test@test.com'
    
    console.log('🔍 Testing chrome-get-contacts endpoint...')
    console.log(`📍 URL: ${contactsUrl}`)
    
    const contactsResponse = await fetch(contactsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w'
      }
    })
    
    console.log(`📊 Contacts response status: ${contactsResponse.status}`)
    const contactsText = await contactsResponse.text()
    console.log('📄 Contacts response:')
    console.log(contactsText)
    
    if (contactsResponse.ok) {
      console.log('✅ Database connection works!')
      
      // Now test a simple client-upload without audio processing
      console.log('🎵 Testing client-upload with minimal data...')
      
      const requestBody = {
        user_name: 'Test',
        user_email: 'test@test.com',
        audio_file: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=',
        profile_url: 'https://linkedin.com/in/test',
        profile_name: 'Test User',
        profile_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      }
      
      const uploadUrl = 'https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload'
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w'
        },
        body: JSON.stringify(requestBody)
      })
      
      console.log(`📊 Upload response status: ${uploadResponse.status}`)
      const uploadText = await uploadResponse.text()
      console.log('📄 Upload response:')
      console.log(uploadText)
      
    } else {
      console.log('❌ Database connection failed')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

testDatabaseOnly()
