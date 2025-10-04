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
  relationship_type: string;
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

export interface AIAction {
  id: string;
  user_id: string;
  contact_id: string;
  action_type: 'connection_request' | 'message_sent' | 'post_liked' | 'comment_posted' | 'profile_viewed';
  action_content: string | null;
  success: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

export interface LinkedInMessage {
  id: string;
  user_id: string;
  contact_id: string;
  sender: 'user' | 'contact';
  message_text: string;
  ai_generated: boolean;
  sent_at: string;
}

export interface MessageData {
  senderName: string;
  senderLinkedInUrl: string;
  messageText: string;
  timestamp: string;
}

export interface LinkedInSelectors {
  messageList: string;
  incomingMessage: string;
  messageBox: string;
  sendButton: string;
  messageText: string;
  senderProfile: string;
}

export type MessageFromContent = {
  type: 'NEW_MESSAGE';
  data: MessageData;
}

export type MessageFromBackground = {
  type: 'SEND_REPLY';
  data: {
    message: string;
  };
} | {
  type: 'SEND_CONNECTION_REQUEST';
  data: {
    profileUrl: string;
    message: string;
  };
}