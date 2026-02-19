-- Create gallery_products table (or alias/copy from gallery_items if desired, but here we create fresh or ensure it exists)
create table if not exists public.gallery_products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,
  images text[] default '{}',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  price numeric,
  external_id text unique -- Link to Gelato/Source ID
);

-- Enable RLS
alter table public.gallery_products enable row level security;

-- Policies
create policy "Public can view gallery products"
  on public.gallery_products for select
  using (true);

create policy "Staff can manage gallery products"
  on public.gallery_products for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );
