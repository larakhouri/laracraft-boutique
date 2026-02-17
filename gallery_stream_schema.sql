-- Run this in your Supabase SQL Editor to enable gallery support

ALTER TABLE atelier_products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';
ALTER TABLE supplies_products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';
ALTER TABLE lifestyle_products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';
