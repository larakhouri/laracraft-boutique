CREATE TABLE IF NOT EXISTS print_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    photo_id UUID REFERENCES products(id),
    photo_title TEXT,
    customer_email TEXT,
    preferred_style TEXT, 
    preferred_size TEXT, 
    status TEXT DEFAULT 'pending' -- 'pending', 'contacted', 'completed'
);
