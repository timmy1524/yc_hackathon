-- Remove follow_up_actions and follow_up_suggestions columns
ALTER TABLE conversations 
DROP COLUMN IF EXISTS follow_up_actions,
DROP COLUMN IF EXISTS follow_up_suggestions;
