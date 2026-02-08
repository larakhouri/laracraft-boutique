-- Final V2 Migration for "Curation of a Maker" Rebrand

-- 1. Rename current type to avoid conflict
ALTER TYPE public.product_category RENAME TO product_category_prev;

-- 2. Create new type with Final names
CREATE TYPE public.product_category AS ENUM (
  'LaraCraft Originals',
  'The Lens Gallery',
  'Print & Paper Studio',
  'The Bespoke Atelier',
  'Maker Supplies'
);

-- 3. Update products table with comprehensive mapping
ALTER TABLE public.products
  ALTER COLUMN category TYPE public.product_category
  USING CASE
    -- Boutique -> LaraCraft Originals
    WHEN category::text = 'Boutique' THEN 'LaraCraft Originals'::public.product_category
    WHEN category::text = 'Artisan Boutique' THEN 'LaraCraft Originals'::public.product_category
    
    -- Gallery -> The Lens Gallery
    WHEN category::text = 'Gallery' THEN 'The Lens Gallery'::public.product_category
    WHEN category::text = 'Photo Gallery' THEN 'The Lens Gallery'::public.product_category
    
    -- POD -> Print & Paper Studio
    WHEN category::text = 'POD' THEN 'Print & Paper Studio'::public.product_category
    WHEN category::text = 'POD Merch' THEN 'Print & Paper Studio'::public.product_category
    
    -- Bespoke -> The Bespoke Atelier
    WHEN category::text = 'Bespoke' THEN 'The Bespoke Atelier'::public.product_category
    WHEN category::text = 'Bespoke Portal' THEN 'The Bespoke Atelier'::public.product_category
    
    -- Supply -> Maker Supplies
    WHEN category::text = 'Supply' THEN 'Maker Supplies'::public.product_category
    WHEN category::text = 'Maker Supplies' THEN 'Maker Supplies'::public.product_category
    
    -- Default Fallback
    ELSE 'LaraCraft Originals'::public.product_category
  END;

-- 4. Drop old type
DROP TYPE product_category_prev;
