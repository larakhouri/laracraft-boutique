-- Migration: Prepare Schema for Imports
-- 1. Create product_categories table for robust management
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Seed Categories (using internal keys to match imports)
INSERT INTO public.product_categories (name, slug) VALUES
    ('Artisan Boutique', 'artisan-boutique'), -- The Atelier
    ('Bespoke Portal', 'bespoke-portal'),     -- Bespoke
    ('POD Merch', 'print-paper-studio'),      -- Print & Paper
    ('Photo Gallery', 'lens-gallery'),        -- Gallery
    ('Maker Supplies', 'maker-supplies')      -- Supplies
ON CONFLICT (name) DO NOTHING;

-- 3. Add category_id to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.product_categories(id);

-- 4. Add status column for Catalog Mode
-- Create type if not exists
DO $$ BEGIN
    CREATE TYPE public.product_status AS ENUM ('active', 'draft', 'catalog_only', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS status public.product_status DEFAULT 'active';

-- 5. Backfill category_id based on existing enum (if any data exists)
-- This assumes the names in ENUM match the names in Table. 
-- Adjust matching logic as needed.
UPDATE public.products p
SET category_id = c.id
FROM public.product_categories c
WHERE p.category::text = c.name;

-- 6. Optional: Set default status for new imports
-- (Handled by application logic or default)
