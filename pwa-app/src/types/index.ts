export interface Contact {
  id: string;
  user_id: string;
  name: string;
  linkedin_url: string;
  linkedin_profile_data: {
    title?: string;
    company?: string;
    location?: string;
  };
  relationship_type: 'potential_client' | 'professional_contact' | 'friend' | 'colleague' | 'other';
  custom_instructions: string | null;
  auto_pilot_enabled: boolean;
  status: 'not_contacted' | 'connection_sent' | 'connected' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  contact_id: string;
  audio_url: string;
  transcription: string | null;
  summary: string | null;
  key_topics: string[];
  ai_analysis: {
    sentiment?: string;
    action_items?: string[];
  };
  duration_seconds: number;
  recorded_at: string;
  processed: boolean;
}

export interface ProcessAudioResponse {
  success: boolean;
  analysis: {
    transcription: string;
    summary: string;
    key_topics: string[];
    suggested_relationship: string;
    action_items: string[];
    sentiment: string;
  };
}

export interface QRScanResult {
  linkedinUrl: string;
  name?: string;
  title?: string;
  company?: string;
}

export interface AudioRecordingState {
  isRecording: boolean;
  duration: number;
  audioBlob: Blob | null;
}