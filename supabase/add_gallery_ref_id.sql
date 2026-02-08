-- Add the link column if not exists
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS gallery_ref_id UUID REFERENCES products(id);

-- Create an index for faster loading of variants
CREATE INDEX IF NOT EXISTS idx_gallery_ref ON products(gallery_ref_id);
