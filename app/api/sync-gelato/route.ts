import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();
    const GELATO_API_KEY = process.env.GELATO_API_KEY;

    if (!GELATO_API_KEY) {
        return NextResponse.json({ error: "Missing GELATO_API_KEY in .env.local" }, { status: 500 });
    }

    try {
        // 1. Get fresh data from Gelato
        const res = await fetch('https://api.gelato.com/v1/products', {
            headers: { 'X-API-KEY': GELATO_API_KEY }
        });
        const data = await res.json();

        // 2. Update Supabase with "Gatekeeper" Logic
        const updates = data.products.map(async (p: any) => {
            // "Gatekeeper": Check product title for category
            const isGallery = p.title.toLowerCase().includes('gallery');
            const table = isGallery ? 'atelier_products' : 'printing_guide';

            // Logic for "Missing Image" - check both possible URL locations
            const imageUrl = p.files?.[0]?.preview_url || p.files?.[0]?.file_url;

            return supabase
                .from(table)
                .upsert({
                    title: p.title,
                    external_id: p.id,
                    image_url: imageUrl,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'external_id' });
        });

        await Promise.all(updates);
        return NextResponse.json({ success: true, message: "Links updated to Feb 16!" });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
