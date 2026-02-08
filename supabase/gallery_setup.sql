-- Create Gallery Table for Visual Narratives
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL, -- English Title/Alt
    story TEXT,             -- Arabic Description/Story
    category_id UUID REFERENCES public.product_categories(id)
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create Policy (Public Read)
CREATE POLICY "Enable read access for all users" ON public.gallery_images
    FOR SELECT USING (true);
