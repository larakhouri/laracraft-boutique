-- This removes all example products so you can start fresh
DELETE FROM products WHERE title LIKE '%Example%' OR title LIKE '%Test%';

-- Optional: To delete EVERYTHING (use with caution)
-- DELETE FROM products;
