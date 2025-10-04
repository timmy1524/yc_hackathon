-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  linkedin_url TEXT NOT NULL UNIQUE,
  linkedin_profile_data JSONB DEFAULT '{}'::jsonb,
  relationship_type TEXT DEFAULT 'professional_contact',
  custom_instructions TEXT,
  auto_pilot_enabled BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'not_contacted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Constraints for contacts
ALTER TABLE contacts ADD CONSTRAINT relationship_type_check 
  CHECK (relationship_type IN ('potential_client', 'professional_contact', 'friend', 'colleague', 'other'));

ALTER TABLE contacts ADD CONSTRAINT status_check 
  CHECK (status IN ('not_contacted', 'connection_sent', 'connected', 'declined'));

-- Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  audio_url TEXT,
  transcription TEXT,
  summary TEXT,
  key_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  duration_seconds INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT false
);

-- Create ai_actions table
CREATE TABLE ai_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_content TEXT,
  success BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Constraint for ai_actions
ALTER TABLE ai_actions ADD CONSTRAINT action_type_check 
  CHECK (action_type IN ('connection_request', 'message_sent', 'post_liked', 'comment_posted', 'profile_viewed'));

-- Create linkedin_messages table
CREATE TABLE linkedin_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL,
  message_text TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Constraint for linkedin_messages
ALTER TABLE linkedin_messages ADD CONSTRAINT sender_check 
  CHECK (sender IN ('user', 'contact'));

-- Create indexes
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_linkedin_url ON contacts(linkedin_url);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_contact_id ON conversations(contact_id);
CREATE INDEX idx_ai_actions_contact_id ON ai_actions(contact_id);
CREATE INDEX idx_ai_actions_user_id ON ai_actions(user_id);
CREATE INDEX idx_linkedin_messages_contact_id ON linkedin_messages(contact_id);
CREATE INDEX idx_linkedin_messages_sent_at ON linkedin_messages(sent_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_messages ENABLE ROW LEVEL SECURITY;

-- Contacts policies
CREATE POLICY "Users can view own contacts" ON contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contacts" ON contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts" ON contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contacts" ON contacts FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON conversations FOR DELETE USING (auth.uid() = user_id);

-- AI Actions policies
CREATE POLICY "Users can view own ai_actions" ON ai_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai_actions" ON ai_actions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ai_actions" ON ai_actions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ai_actions" ON ai_actions FOR DELETE USING (auth.uid() = user_id);

-- LinkedIn Messages policies
CREATE POLICY "Users can view own linkedin_messages" ON linkedin_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own linkedin_messages" ON linkedin_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own linkedin_messages" ON linkedin_messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own linkedin_messages" ON linkedin_messages FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to contacts table
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();