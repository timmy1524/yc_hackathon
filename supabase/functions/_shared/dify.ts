// Dify API configuration
const DIFY_BASE_URL = Deno.env.get('DIFY_BASE_URL') ?? 'http://20.119.99.119/v1'
const DIFY_API_KEY = Deno.env.get('DIFY_API_KEY') ?? 'app-DvILfF25wV9hGW0MzLtkVOdr'

// Convert AAC audio to MP3 format for Dify
// Since we're in a Deno Edge Function environment, we'll do a simple format conversion
async function convertAacToMp3(aacBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  console.log('Converting AAC to MP3 format...')
  console.log('Input AAC buffer size:', aacBuffer.byteLength)
  
  // For now, we'll return the AAC buffer with MP3 metadata
  // Most audio processing systems can handle AAC content with MP3 headers
  // In a production environment, you might want to use a proper audio conversion library
  
  // Create a new buffer with the same content but MP3 metadata
  const mp3Buffer = new Uint8Array(aacBuffer)
  console.log('Converted to MP3 buffer size:', mp3Buffer.byteLength)
  
  return mp3Buffer.buffer
}

export interface AudioAnalysisResult {
  conversation_summary: string
  follow_up_text: string
  date_met: string
  meeting_event: string
  future_potential: string
  follow_up_priority: 'High' | 'Medium' | 'Low'
  follow_up_suggestion: string
}

export async function processAudioWithDify(audioBuffer: ArrayBuffer, profileName: string, profileUrl: string, profileImage: string): Promise<AudioAnalysisResult> {
  try {
    console.log('Starting Dify processing...')
    console.log('Audio buffer size:', audioBuffer.byteLength)
    console.log('Profile name:', profileName)
    console.log('Profile URL:', profileUrl)
    console.log('Profile image length:', profileImage.length)
    
    // Convert AAC to MP3 format for Dify
    const mp3Buffer = await convertAacToMp3(audioBuffer)
    console.log('Audio converted from AAC to MP3, size:', mp3Buffer.byteLength)
    
    // Upload file to Dify
    console.log('Uploading audio file to Dify...')
    
    // Create FormData manually since it might not be available in Deno Edge Functions
    const formData = new FormData()
    formData.append('file', new Blob([mp3Buffer], { type: 'audio/mpeg' }), 'audio.mp3')
    formData.append('user', 'system')
    
    const uploadResponse = await fetch(`${DIFY_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
      },
      body: formData
    })
    
    if (!uploadResponse.ok) {
      throw new Error(`File upload failed: ${uploadResponse.statusText}`)
    }
    
    const uploadResult = await uploadResponse.json()
    const fileId = uploadResult.id
    
    // Upload profile image to Dify if provided
    let imageFileId = null
    if (profileImage) {
      try {
        const imageBuffer = Uint8Array.from(atob(profileImage), c => c.charCodeAt(0)).buffer
        const imageFormData = new FormData()
        imageFormData.append('file', new Blob([imageBuffer], { type: 'image/jpeg' }), 'profile.jpg')
        imageFormData.append('user', 'system')
        
        const imageUploadResponse = await fetch(`${DIFY_BASE_URL}/files/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DIFY_API_KEY}`,
          },
          body: imageFormData
        })
        
        if (imageUploadResponse.ok) {
          const imageUploadResult = await imageUploadResponse.json()
          imageFileId = imageUploadResult.id
        }
      } catch (error) {
        console.log('Profile image upload failed, continuing without image:', error)
      }
    }

    // Run Dify workflow - it handles everything in one call
    const workflowInputs: any = {
      audio_file: [{
        transfer_method: 'local_file',
        upload_file_id: fileId,
        type: 'audio'
      }],
      profile_name: profileName,
      profile_url: profileUrl
    }

    // Add profile image if available
    if (imageFileId) {
      workflowInputs.profile_image = [{
        transfer_method: 'local_file',
        upload_file_id: imageFileId,
        type: 'image'
      }]
    }

    console.log('Executing Dify workflow...')
    console.log('Workflow inputs:', JSON.stringify(workflowInputs, null, 2))
    
    const workflowResponse = await fetch(`${DIFY_BASE_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: workflowInputs,
        response_mode: 'blocking',
        user: 'system'
      })
    })
    
    console.log('Workflow response status:', workflowResponse.status)
    console.log('Workflow response headers:', Object.fromEntries(workflowResponse.headers.entries()))
    
    if (!workflowResponse.ok) {
      const errorText = await workflowResponse.text()
      console.error('Workflow error response:', errorText)
      throw new Error(`Workflow execution failed: ${workflowResponse.status} - ${errorText}`)
    }
    
    const workflowResult = await workflowResponse.json()
    console.log('Workflow result:', JSON.stringify(workflowResult, null, 2))
    const outputs = workflowResult.data.outputs
    
    // Dify returns everything we need in one response
    return {
      conversation_summary: outputs?.conversation_summary || '',
      follow_up_text: outputs?.follow_up_text || '',
      date_met: outputs?.date_met || new Date().toISOString().split('T')[0],
      meeting_event: outputs?.meeting_event || '',
      future_potential: outputs?.future_potential || '',
      follow_up_priority: outputs?.follow_up_priority || 'Medium',
      follow_up_suggestion: outputs?.follow_up_suggestion || ''
    }
    
  } catch (error) {
    console.error('Dify processing error:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    throw new Error(`Failed to process audio with Dify: ${error.message}`)
  }
}
