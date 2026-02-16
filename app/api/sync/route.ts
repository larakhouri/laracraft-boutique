import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();
    const apiKey = process.env.GELATO_API_KEY;
    const storeId = process.env.GELATO_STORE_ID;

    if (!storeId || storeId === "your_id_here") {
        return NextResponse.json({ success: false, error: "GELATO_STORE_ID missing" });
    }

    try {
        const response = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${storeId}/products`, {
            headers: { 'X-API-KEY': apiKey?.trim() || '' }
        });
        const data = await response.json();

        // 📊 Updated tracker for the 5 active sync vaults
        const distribution = {
            guide: 0,
            gallery: 0,
            supplies: 0,
            lifestyle: 0, // "Finalize Your Gift"
            designs: 0
        };

        for (const p of data.products) {
            let cleanTitle = p.title;
            let targetTable = 'printed_designs'; // Default
            const titleLower = p.title.toLowerCase();

            // 🛡️ 1. GUIDE CHECK (Technical specs in Gallery)
            if (p.title.includes('[GUIDE]')) {
                targetTable = 'printing_guide';
                cleanTitle = p.title.replace('[GUIDE]', '').trim();
                distribution.guide++;
            }
            // 🎁 2. LIFESTYLE / GIFT CHECK (Mugs, Trays, Mix & Match items)
            // TRIGGER: Use [LIFESTYLE] in Gelato title or keywords
            else if (p.title.includes('[LIFESTYLE]') || titleLower.includes('lifestyle')) {
                targetTable = 'lifestyle_products';
                cleanTitle = p.title.replace('[LIFESTYLE]', '').trim();
                distribution.lifestyle++;
            }
            // 🖼️ 3. GALLERY CHECK (Photography)
            else if (titleLower.includes('photo') || titleLower.includes('gallery')) {
                targetTable = 'gallery_products';
                distribution.gallery++;
            }
            // 🛠️ 4. SUPPLIES CHECK (Makers Tools / Content Gear)
            else if (titleLower.includes('supply') || titleLower.includes('tool') || titleLower.includes('brush')) {
                targetTable = 'supplies_products';
                distribution.supplies++;
            }
            // 📦 5. ALL OTHER ART POD (Main designs)
            else {
                targetTable = 'printed_designs';
                distribution.designs++;
            }

            const productData = {
                external_id: p.id,
                title: cleanTitle,
                image_url: p.previewUrl || p.preview_url,
                price: 0,
                updated_at: new Date()
            };

            // Upsert into the determined table
            await supabase.from(targetTable).upsert(productData, { onConflict: 'external_id' });
        }

        return NextResponse.json({
            success: true,
            message: "5-Vault Sync Complete",
            counts: distribution
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}