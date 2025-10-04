export interface UploadRequest {
  user_name: string
  user_email: string
  audio_file: string // base64 encoded audio
  profile_url: string
  profile_name: string
}

export interface UploadResponse {
  status: 'success' | 'error'
  message: string
}

export interface GetContactsRequest {
  user_name: string
  user_email: string
}

export interface Contact {
  name: string
  profile_url: string
  conversation_summary: string
  follow_up_text: string
  date_met?: string
  meeting_event?: string
  future_potential?: string
  follow_up_priority?: 'High' | 'Medium' | 'Low'
  follow_up_suggestion?: string
}

export interface GetContactsResponse {
  status: 'success' | 'error'
  message: string
  contacts?: Contact[]
}
