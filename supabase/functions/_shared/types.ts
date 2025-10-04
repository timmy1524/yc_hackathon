export interface User {
  id: string
  user_name: string
  user_email: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  user_id: string
  name: string
  profile_url: string
  conversation_summary?: string
  follow_up_actions?: string[]
  follow_up_suggestions?: string
  follow_up_text?: string
  created_at: string
  updated_at: string
}

export interface UploadRequest {
  user_name: string
  user_email: string
  audio_file: string // base64 encoded audio
  profile_url: string
  profile_name: string
}

export interface GetContactsRequest {
  user_name: string
  user_email: string
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message: string
  data?: T
}

export interface LLMResponse {
  conversation_summary: string
  follow_up_actions: string[]
  follow_up_suggestions: string
  follow_up_text: string
}
