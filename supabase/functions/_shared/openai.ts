const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!

export class OpenAIClient {
  private apiKey: string

  constructor() {
    this.apiKey = OPENAI_API_KEY
  }

  async transcribeAudio(audioUrl: string): Promise<string> {
    const response = await fetch(audioUrl)
    const audioBlob = await response.blob()
    
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    })

    const result = await transcriptionResponse.json()
    return result.text
  }

  async generateCompletion(prompt: string, maxTokens: number = 1000): Promise<{
    text: string
    usage: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
  }> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    })

    const result = await response.json()
    
    return {
      text: result.choices[0].message.content,
      usage: result.usage
    }
  }
}