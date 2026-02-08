-- Injecting 12 Luxury Placeholders to test the 6-column Comfort Grid
-- NOTE: Using 'category_slug' based on application schema.

INSERT INTO products (title, category_slug, image_url, price)
VALUES 
-- Printed Designs (8 items)
('Artisan Linen Print', 'printed-designs', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=500', 45.00),
('Midnight Botanical', 'printed-designs', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=500', 55.00),
('Nebula Archival Print', 'printed-designs', 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=500', 65.00),
('Ethereal Forest', 'printed-designs', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=500', 48.00),
('Geometric Harmony', 'printed-designs', 'https://images.unsplash.com/photo-1550684848-bf18ea964060?q=80&w=500', 52.00),
('Oceanic Whisper', 'printed-designs', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=500', 58.00),
('Vintage Map Reproduction', 'printed-designs', 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=500', 75.00),
('Abstract Gold Foil', 'printed-designs', 'https://images.unsplash.com/photo-1507643179173-617d65455631?q=80&w=500', 85.00),

-- Makers Supplies (4 items)
('Maker Canvas Kit', 'supplies', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=500', 120.00),
('Premium Bookbinding Glue', 'supplies', 'https://images.unsplash.com/photo-1586075010923-2dd45eeed8bd?q=80&w=500', 25.00),
('Japanese Washi Tape Set', 'supplies', 'https://images.unsplash.com/photo-1530666035049-74e5055018cb?q=80&w=500', 35.00),
('Brass Ruler & Protractor', 'supplies', 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=500', 45.00);
