-- Copy and paste this into your Supabase SQL Editor to seed test data

-- 1. Create Sample Product: Handcrafted Artisan Candle
INSERT INTO public.products (title, description, price, category, image_url)
VALUES (
  'Handcrafted Artisan Candle', 
  'A soothing blend of sage and driftwood, hand-poured into a ceramic vessel.', 
  45.00, 
  'Boutique', 
  'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?q=80&w=1000' -- Valid placeholder
);

-- 2. Create Sample Project: Bespoke Wood Carving
-- Attached to the first available user in the system
INSERT INTO public.projects (customer_id, title, status, progress_updates)
SELECT 
  id, 
  'Bespoke Wood Carving', 
  'In Progress',
  jsonb_build_array(
    jsonb_build_object(
      'date', now(),
      'note', 'Carving initiated. Selected walnut wood block.',
      'image_url', ''
    )
  )
FROM auth.users
LIMIT 1;
