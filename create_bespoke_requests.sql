-- Create the missing intake table
CREATE TABLE IF NOT EXISTS bespoke_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT,
  email TEXT,
  vision_description TEXT,
  budget TEXT,
  status TEXT DEFAULT 'pending'
);

-- 🟢 Fix Row Level Security (RLS) 
-- This allows people to submit forms without being logged in first
ALTER TABLE bespoke_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public submissions" 
ON bespoke_requests FOR INSERT 
WITH CHECK (true);

-- Policy to allow admins to view
CREATE POLICY "Allow admin view" ON bespoke_requests FOR SELECT USING (true);
