-- Add an external_id column if it doesn't exist to link with Gelato
ALTER TABLE products ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;
