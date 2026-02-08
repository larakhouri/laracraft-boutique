-- 1. Add the digital flag
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT FALSE;

-- 2. Mark all Gallery items as digital artifacts
UPDATE products SET is_digital = TRUE WHERE category_slug = 'gallery';
