-- Create a custom enum for user roles
create type user_role as enum ('super_admin', 'staff', 'customer');

-- Create a profiles table that mirrors the auth.users table
create table public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  email text,
  role user_role default 'customer'::user_role,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies
-- 1. Users can view their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using ( auth.uid() = id );

-- 2. Users can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using ( auth.uid() = id );

-- 3. Super admins can view all profiles
create policy "Super admins can view all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Products Table
create type product_category as enum ('Bespoke', 'Boutique', 'POD', 'Gallery', 'Supply');

create table public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric(10, 2) not null,
  category product_category not null,
  image_url text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for Products
alter table public.products enable row level security;

create policy "Public can view products"
  on public.products
  for select
  using (true);

create policy "Staff and Admins can insert products"
  on public.products
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );

create policy "Staff and Admins can update products"
  on public.products
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );

-- Storage Policies (for product-images bucket)
create policy "Public can view product images"
on storage.objects for select
using ( bucket_id = 'product-images' );

create policy "Staff and Admins can upload product images"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'super_admin')
  )
);

-- Projects Table (Passport)
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  status text default 'In Progress',
  progress_updates jsonb default '[]'::jsonb, -- Array of { date, note, image_url }
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for Projects
alter table public.projects enable row level security;

create policy "Customers can view own projects"
  on public.projects
  for select
  using (auth.uid() = customer_id);

create policy "Staff and Admins can view/edit all projects"
  on public.projects
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );

-- Add external_id for Printify Sync
alter table public.products add column external_id text unique;


-- Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  stripe_session_id text unique,
  amount_total numeric(10, 2) not null,
  currency text default 'usd',
  status text default 'pending', -- pending, paid, shipped
  created_at timestamptz default now()
);

-- Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id),
  quantity integer not null default 1,
  price_at_purchase numeric(10, 2) not null
);

-- RLS for Orders
alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders
  for select
  using (auth.uid() = user_id);

create policy "Staff can view all orders"
  on public.orders
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );


-- Leads Table (Catalog Mode)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  message text,
  product_id uuid references public.products(id),
  status text default 'new', -- new, contacted, converted
  created_at timestamptz default now()
);

-- RLS for Leads
alter table public.leads enable row level security;

create policy "Staff can view all leads"
  on public.leads
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );

create policy "Public can insert leads"
  on public.leads
  for insert
  with check (true);


-- Behind the Craft
alter table public.products add column craft_process jsonb default '[]'::jsonb;
alter table public.products add column materials text[] default '{}';


-- Consultations Table
create table public.consultations (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  message text not null,
  product_id uuid references public.products(id),
  status text default 'pending', -- pending, replied, closed
  created_at timestamptz default now()
);

-- RLS for Consultations
alter table public.consultations enable row level security;

create policy "Staff can view all consultations"
  on public.consultations
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('staff', 'super_admin')
    )
  );

create policy "Public can insert consultations"
  on public.consultations
  for insert
  with check (true);


-- Share Token for Private Sharing
alter table public.projects add column share_token uuid default gen_random_uuid();
create index projects_share_token_idx on public.projects (share_token);

create policy "Public can view projects via share token"
  on public.projects
  for select
  using (true); 


