// ============================================================================
// USER SYSTEM TYPES
// ============================================================================

export interface User {
  id: string
  email: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  display_name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface RegistrationRequest {
  email: string
  password: string
  display_name?: string
  first_name?: string
  last_name?: string
}

export interface ProfileUpdateRequest {
  display_name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
}

// ============================================================================
// CONVERSATION TYPES
// ============================================================================

export interface Conversation {
  id: string
  user_id: string
  profile_name: string
  profile_url: string
  conversation_summary?: string
  follow_up_text?: string
  date_met?: string
  meeting_event?: string
  future_potential?: string
  follow_up_priority?: 'High' | 'Medium' | 'Low'
  follow_up_suggestion?: string
  created_at: string
  updated_at: string
}

export interface ConversationStats {
  total: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  thisMonth: number
}

// ============================================================================
// AUDIO UPLOAD TYPES
// ============================================================================

export interface AudioUploadRequest {
  audio_file: string // base64 encoded audio
  profile_url: string
  profile_name: string
  profile_image?: string // base64 encoded image
}

export interface AudioUploadResponse {
  status: 'success' | 'error'
  message: string
}

// ============================================================================
// AUDIO ANALYSIS TYPES
// ============================================================================

export interface AudioAnalysisResult {
  conversation_summary: string
  follow_up_text: string
  date_met: string
  meeting_event: string
  future_potential: string
  follow_up_priority: 'High' | 'Medium' | 'Low'
  follow_up_suggestion: string
}

// ============================================================================
// CONTACTS TYPES (Legacy - for Chrome Extension)
// ============================================================================

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

export interface GetContactsRequest {
  user_name: string
  user_email: string
}

export interface GetContactsResponse {
  status: 'success' | 'error'
  message: string
  contacts?: Contact[]
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationOptions {
  limit: number
  offset: number
  orderBy: string
  orderDirection: 'asc' | 'desc'
}

export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success?: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationInfo
}

export interface ErrorResponse {
  error: string
  details?: string
  code?: string
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string
  message: string
}

// ============================================================================
// EMAIL TYPES
// ============================================================================

export interface EmailData {
  user_name: string
  profile_name: string
  profile_url: string
  analysis: {
    conversation_summary?: string
    date_met?: string
    meeting_event?: string
    follow_up_priority?: string
    follow_up_suggestion?: string
  }
}
