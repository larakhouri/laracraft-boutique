-- Migration to update product_category enum to new standard names

-- 1. Rename old type to avoid conflict
ALTER TYPE public.product_category RENAME TO product_category_old;

-- 2. Create new type with new values
CREATE TYPE public.product_category AS ENUM (
  'Bespoke Portal',
  'Artisan Boutique',
  'POD Merch',
  'Photo Gallery',
  'Maker Supplies'
);

-- 3. Update products table to use new type with mapping
ALTER TABLE public.products
  ALTER COLUMN category TYPE public.product_category
  USING CASE
    WHEN category::text = 'Bespoke' THEN 'Bespoke Portal'::public.product_category
    WHEN category::text = 'Boutique' THEN 'Artisan Boutique'::public.product_category
    WHEN category::text = 'POD' THEN 'POD Merch'::public.product_category
    WHEN category::text = 'Gallery' THEN 'Photo Gallery'::public.product_category
    WHEN category::text = 'Supply' THEN 'Maker Supplies'::public.product_category
    ELSE 'Artisan Boutique'::public.product_category -- Default fallback
  END;

-- 4. Drop old type
DROP TYPE product_category_old;
