-- 1. Add standard artisan columns to printing_guide if missing
CREATE TABLE IF NOT EXISTS printing_guide (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text,
    description text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE printing_guide 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS price numeric,
ADD COLUMN IF NOT EXISTS description_de text,
ADD COLUMN IF NOT EXISTS description_ar text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS external_id text; -- Ensure external_id exists for the universal resolver

-- 2. Migrate the "Wall Print" data 
-- (Assuming they currently live in 'printed_designs' or 'products')
-- INSERT INTO printing_guide (title, description, price, image_url, images, updated_at)
-- SELECT title, description, price, image_url, images, updated_at
-- FROM printed_designs
-- WHERE title ILIKE '%wall print%'; 

-- 4. Enable RLS and add management policies
ALTER TABLE printing_guide ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin Manage Printing" ON printing_guide;
DROP POLICY IF EXISTS "Allow public read" ON printing_guide;

-- Admin Policy (Full Access)
CREATE POLICY "Admin Manage Printing" 
ON printing_guide 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- Public Read Policy
CREATE POLICY "Allow public read" 
ON printing_guide 
FOR SELECT 
TO public 
USING (true);
