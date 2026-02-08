-- Create the products bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Policy to allow specific email to insert products
drop policy if exists "Allow specific email to insert products" on public.products;
create policy "Allow specific email to insert products"
on public.products
for insert
with check ( auth.jwt() ->> 'email' = 'lara.khouri19@gmail.com' );

-- Policy to allow specific email to update products
drop policy if exists "Allow specific email to update products" on public.products;
create policy "Allow specific email to update products"
on public.products
for update
using ( auth.jwt() ->> 'email' = 'lara.khouri19@gmail.com' )
with check ( auth.jwt() ->> 'email' = 'lara.khouri19@gmail.com' );

-- Storage Policies for 'products' bucket

-- 1. Allow public select (viewing images)
drop policy if exists "Public can select products bucket" on storage.objects;
create policy "Public can select products bucket"
on storage.objects for select
using ( bucket_id = 'products' );

-- 2. Allow Lara to upload
drop policy if exists "Allow Lara to upload to products bucket" on storage.objects;
create policy "Allow Lara to upload to products bucket"
on storage.objects
for insert
with check (
  bucket_id = 'products'
  and auth.jwt() ->> 'email' = 'lara.khouri19@gmail.com'
);

-- 3. Allow Lara to update/delete (optional but good for management)
drop policy if exists "Allow Lara to update products bucket" on storage.objects;
create policy "Allow Lara to update products bucket"
on storage.objects
for update
using (
  bucket_id = 'products'
  and auth.jwt() ->> 'email' = 'lara.khouri19@gmail.com'
);

drop policy if exists "Allow Lara to delete from products bucket" on storage.objects;
create policy "Allow Lara to delete from products bucket"
on storage.objects
for delete
using (
  bucket_id = 'products'
  and auth.jwt() ->> 'email' = 'lara.khouri19@gmail.com'
);
