-- Migration: 20260216_atelier_restoration
-- Description: Create 4 distinct vaults for product categories to ensure isolation and safety.

-- 1. THE ATELIER
-- High-end, handmade items.
create table if not exists public.atelier (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric(10, 2) not null default 0,
  image_url text not null,
  external_id text unique, -- Gelato Product ID
  metadata jsonb default '{}'::jsonb, -- Stores "Midnight Teal" branding tags
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.atelier enable row level security;

-- Policies
create policy "Public view atelier" on public.atelier for select using (true);
create policy "Staff manage atelier" on public.atelier for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('staff', 'super_admin'))
);


-- 2. THE LENS GALLERY
-- Photography prints.
create table if not exists public.gallery (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric(10, 2) not null default 0,
  image_url text not null,
  external_id text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.gallery enable row level security;

create policy "Public view gallery" on public.gallery for select using (true);
create policy "Staff manage gallery" on public.gallery for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('staff', 'super_admin'))
);


-- 3. PRINTED DESIGNS (POD)
-- Paper goods, cards, etc.
create table if not exists public.printed_designs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric(10, 2) not null default 0,
  image_url text not null,
  external_id text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.printed_designs enable row level security;

create policy "Public view printed_designs" on public.printed_designs for select using (true);
create policy "Staff manage printed_designs" on public.printed_designs for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('staff', 'super_admin'))
);


-- 4. MAKER SUPPLIES
-- Tools and materials.
create table if not exists public.supplies (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric(10, 2) not null default 0,
  image_url text not null,
  external_id text unique,
  stock_status text default 'in_stock',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.supplies enable row level security;

create policy "Public view supplies" on public.supplies for select using (true);
create policy "Staff manage supplies" on public.supplies for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('staff', 'super_admin'))
);
