-- Allow the public to view files in the products bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'products');

-- Allow authenticated users to upload to the products bucket
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'products');

-- Allow authenticated users to update/delete their files
CREATE POLICY "Admin Manage" ON storage.objects FOR ALL TO public USING (bucket_id = 'products');
