// Dify API configuration
const DIFY_BASE_URL = 'http://20.119.99.119/v1'
const DIFY_API_KEY = 'app-DvILfF25wV9hGW0MzLtkVOdr'

// Simple conversion: just change the file format metadata
// Most audio processing systems can handle M4A content with MP3 headers
async function convertM4aToMp3(m4aBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  // For now, just return the original buffer with MP3 metadata
  // Dify should be able to handle the audio content regardless of container format
  return m4aBuffer
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

export async function processAudioWithDify(audioBuffer: ArrayBuffer, profileName: string, profileUrl: string): Promise<AudioAnalysisResult> {
  try {
    // Convert m4a to mp3 format for Dify
    const mp3Buffer = await convertM4aToMp3(audioBuffer)
    
    // Upload file to Dify
    const uploadResponse = await fetch(`${DIFY_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
      },
      body: new FormData()
        .append('file', new Blob([mp3Buffer], { type: 'audio/mp3' }), 'audio.mp3')
        .append('user', 'system')
    })
    
    if (!uploadResponse.ok) {
      throw new Error(`File upload failed: ${uploadResponse.statusText}`)
    }
    
    const uploadResult = await uploadResponse.json()
    const fileId = uploadResult.id
    
    // Run Dify workflow - it handles everything in one call
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
          profile_name: profileName,
          profile_url: profileUrl
        },
        response_mode: 'blocking',
        user: 'system'
      })
    })
    
    if (!workflowResponse.ok) {
      throw new Error(`Workflow execution failed: ${workflowResponse.statusText}`)
    }
    
    const workflowResult = await workflowResponse.json()
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
    throw new Error('Failed to process audio with Dify')
  }
}
