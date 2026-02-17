-- 1. Add missing columns to Atelier
ALTER TABLE "public"."atelier_products" 
ADD COLUMN IF NOT EXISTS "images" text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "description_de" text,
ADD COLUMN IF NOT EXISTS "description_ar" text;

-- 2. Add missing columns to the old Printed Designs table
ALTER TABLE "public"."printed_designs" 
ADD COLUMN IF NOT EXISTS "images" text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "description" text,
ADD COLUMN IF NOT EXISTS "description_de" text,
ADD COLUMN IF NOT EXISTS "description_ar" text;

-- 3. Ensure RLS is open for both
ALTER TABLE "public"."atelier_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."printed_designs" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON "public"."atelier_products";
DROP POLICY IF EXISTS "Allow public read" ON "public"."printed_designs";

CREATE POLICY "Allow public read" ON "public"."atelier_products" FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read" ON "public"."printed_designs" FOR SELECT TO public USING (true);
