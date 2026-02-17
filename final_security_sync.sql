-- 1. Enable RLS on all active vaults
ALTER TABLE "public"."printing_guide" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."printed_designs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."gallery_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."supplies_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."offers" ENABLE ROW LEVEL SECURITY;

-- 2. Create Public Read Policies (The "Gallery View" key)
-- Note: Dropping existing policies first to ensure no conflicts
DROP POLICY IF EXISTS "Public Access" ON "public"."printing_guide";
CREATE POLICY "Public Access" ON "public"."printing_guide" FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Access" ON "public"."printed_designs";
CREATE POLICY "Public Access" ON "public"."printed_designs" FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Access" ON "public"."gallery_products";
CREATE POLICY "Public Access" ON "public"."gallery_products" FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Access" ON "public"."supplies_products";
CREATE POLICY "Public Access" ON "public"."supplies_products" FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public Access" ON "public"."offers";
CREATE POLICY "Public Access" ON "public"."offers" FOR SELECT TO public USING (true);

-- 3. Column Alignment (Ensure all tables support trilingual stories)
ALTER TABLE "public"."atelier_products" 
ADD COLUMN IF NOT EXISTS "description_de" text, 
ADD COLUMN IF NOT EXISTS "description_ar" text, 
ADD COLUMN IF NOT EXISTS "images" text[] DEFAULT '{}';

ALTER TABLE "public"."printed_designs" 
ADD COLUMN IF NOT EXISTS "description_de" text, 
ADD COLUMN IF NOT EXISTS "description_ar" text, 
ADD COLUMN IF NOT EXISTS "images" text[] DEFAULT '{}';
