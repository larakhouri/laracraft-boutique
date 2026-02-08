UPDATE products 
SET category_slug = 'gallery-variant' 
WHERE title LIKE '%Amethyst Mist%' 
AND category_slug != 'gallery'; -- Don't hide the original photo!
