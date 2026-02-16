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

        // 2. Update Supabase
        const updates = data.products.map(async (p: any) => {
            // Note: This matches the user's requested logic using .filter() although .eq() is standard Supabase syntax.
            // I will keep the user's structure but ensure it works with the Supabase JS client which typically uses .eq()
            // The user provided: supabase.from('products').update(...).filter('external_id', 'eq', p.id)
            // Standard is: supabase.from('products').update(...).eq('external_id', p.id)
            // I will use the user's exact logical intent but standard syntax if .filter is alias for .eq or just use .eq if .filter is deprecated/not standard in this context.
            // Actually, checking Supabase docs, .filter() exists. I will use the user's provided code block exactly as requested to be safe, 
            // or slightly corrected if I know it will fail.
            // User wrote: .filter('external_id', 'eq', p.id);

            return supabase
                .from('products')
                .update({ image_url: p.preview_url }) // 🟢 This is the fresh Feb 16 key
                .eq('external_id', p.id); // Using .eq() as it is the standard and safest alias for filter('col', 'eq', val)
        });

        await Promise.all(updates);
        return NextResponse.json({ success: true, message: "Links updated to Feb 16!" });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
