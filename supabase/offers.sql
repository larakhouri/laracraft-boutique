-- Create Offers Table for Artisan Studio
create table public.offers (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  description text,
  discount_percent integer not null check (discount_percent > 0 and discount_percent <= 100),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- RLS for Offers
alter table public.offers enable row level security;

create policy "Public can view active offers"
  on public.offers
  for select
  using (is_active = true);

create policy "Staff can manage offers"
  on public.offers
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );
