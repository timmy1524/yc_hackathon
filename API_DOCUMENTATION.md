# LinkedIn AI Assistant - Backend API

## Overview
This backend provides two main endpoints for processing audio conversations and managing LinkedIn contacts with AI insights.

## Database Schema

### `conversations` Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  profile_name TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  conversation_summary TEXT,
  follow_up_text TEXT,
  date_met DATE,
  meeting_event TEXT,
  future_potential TEXT,
  follow_up_priority TEXT CHECK (follow_up_priority IN ('High', 'Medium', 'Low')),
  follow_up_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### 1. Upload Audio and Process Conversation
**Endpoint:** `POST /functions/v1/client-upload`

**Request Body:**
```json
{
  "user_name": "Amber",
  "user_email": "amber@gmail.com", 
  "audio_file": "base64_encoded_audio_data",
  "profile_url": "https://www.linkedin.com/in/jason",
  "profile_name": "Jason"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Audio uploaded successfully"
}
```

**Error Response:**
```json
{
  "status": "error", 
  "message": "Audio upload failed"
}
```

### 2. Get User's Contacts with AI Insights
**Endpoint:** `GET /functions/v1/chrome-get-contacts`

**Query Parameters:**
- `user_name`: User's name
- `user_email`: User's email

**Example:** `/functions/v1/chrome-get-contacts?user_name=Amber&user_email=amber@gmail.com`

**Response:**
```json
{
  "status": "success",
  "message": "Contacts fetched successfully",
  "contacts": [
    {
      "name": "Jason",
      "profile_url": "https://www.linkedin.com/in/jason",
      "conversation_summary": "we had a great conversation about the project",
      "follow_up_text": "send a message to Jason about the project",
      "date_met": "2025-01-01",
      "meeting_event": "Tech Conference 2025",
      "future_potential": "Strong potential for collaboration on AI projects",
      "follow_up_priority": "High",
      "follow_up_suggestion": "Send a personalized message about the AI project discussion"
    }
  ]
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Contacts fetch failed"
}
```

## AI Processing Pipeline

1. **Audio Processing**: Uses Dify workflow to handle audio transcription and analysis
2. **Conversation Analysis**: Uses Dify AI workflow to analyze the conversation and generate:
   - Conversation summary
   - Follow-up text (exact message to send)
   - Date met (when you first met or connected)
   - Meeting event (name of event, place, or context)
   - Future potential (insights into potential future relationship)
   - Follow-up priority (High, Medium, or Low)
   - Follow-up suggestion (AI-generated suggestion for follow-up message content)

## Environment Variables Required

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for database access

## Dify Integration

The backend uses Dify workflows for AI processing:
- **Base URL**: `http://20.119.99.119/v1`
- **API Key**: `app-DvILfF25wV9hGW0MzLtkVOdr`
- **Workflow**: Handles both audio transcription and conversation analysis

## Deployment

The functions are deployed to Supabase Edge Functions and can be accessed at:
- `https://shktirpoweaqcvvleldo.supabase.co/functions/v1/client-upload`
- `https://shktirpoweaqcvvleldo.supabase.co/functions/v1/chrome-get-contacts`

## Security

- Row Level Security (RLS) is enabled on the conversations table
- Users can only access their own conversation data
- CORS headers are configured for cross-origin requests
