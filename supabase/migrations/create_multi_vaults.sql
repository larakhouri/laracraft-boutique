-- Create printed_designs table
create table if not exists public.printed_designs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,
  price numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  external_id text unique
);

-- Create supplies table
create table if not exists public.supplies (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,
  price numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  external_id text unique
);

-- Create FinalGifts table (using quoted identifier to match user request if strict, but snake_case is better. I'll use PascalCase for the table name to match the prompt exactly if that's what the sync script expects, or better, map it.)
-- Mapping: 'FinalGifts' -> public."FinalGifts"
create table if not exists public."FinalGifts" (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,
  price numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  external_id text unique
);

-- Enable RLS
alter table public.printed_designs enable row level security;
alter table public.supplies enable row level security;
alter table public."FinalGifts" enable row level security;

-- Policies (Public Read, Staff Write)
create policy "Public can view printed_designs" on public.printed_designs for select using (true);
create policy "Staff can manage printed_designs" on public.printed_designs for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('staff', 'super_admin')));

create policy "Public can view supplies" on public.supplies for select using (true);
create policy "Staff can manage supplies" on public.supplies for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('staff', 'super_admin')));

create policy "Public can view FinalGifts" on public."FinalGifts" for select using (true);
create policy "Staff can manage FinalGifts" on public."FinalGifts" for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('staff', 'super_admin')));
