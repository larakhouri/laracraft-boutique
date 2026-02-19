-- Create a table for Fine Art Gallery items if not exists
create table if not exists public.gallery_items (
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
alter table public.gallery_items enable row level security;

-- Policies
create policy "Public can view gallery items"
  on public.gallery_items for select
  using (true);

create policy "Staff can manage gallery items"
  on public.gallery_items for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );

-- Ensure printing_guide has necessary columns (just in case migration didn't run or is partial)
create table if not exists public.printing_guide (
    id uuid default gen_random_uuid() primary key,
    title text,
    description text,
    image_url text,
    images text[] default '{}',
    price numeric,
    metadata jsonb default '{}'::jsonb,
    external_id text unique,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.printing_guide enable row level security;

create policy "Public can view printing guide"
  on public.printing_guide for select
  using (true);

create policy "Staff can manage printing guide"
  on public.printing_guide for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );
