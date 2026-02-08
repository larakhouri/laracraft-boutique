-- Run this in Supabase SQL Editor to support Full Name

-- 1. Add full_name column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;

-- 2. Update the handle_new_user function to capture full_name from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id, 
    new.email, 
    'customer',
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
