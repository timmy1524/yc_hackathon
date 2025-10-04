-- Add new LLM fields to conversations table
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS date_met DATE,
ADD COLUMN IF NOT EXISTS meeting_event TEXT,
ADD COLUMN IF NOT EXISTS future_potential TEXT,
ADD COLUMN IF NOT EXISTS follow_up_priority TEXT CHECK (follow_up_priority IN ('High', 'Medium', 'Low')),
ADD COLUMN IF NOT EXISTS follow_up_suggestion TEXT;

-- Create index for follow_up_priority for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_follow_up_priority ON conversations(follow_up_priority);

-- Create index for date_met for chronological queries
CREATE INDEX IF NOT EXISTS idx_conversations_date_met ON conversations(date_met DESC);
