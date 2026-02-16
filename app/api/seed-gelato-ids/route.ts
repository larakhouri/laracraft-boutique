import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();
    const GELATO_API_KEY = process.env.GELATO_API_KEY;

    if (!GELATO_API_KEY) {
        return NextResponse.json({ error: "Missing GELATO_API_KEY" }, { status: 500 });
    }

    try {
        // 1. Fetch ALL Gelato Products
        const gelatoRes = await fetch('https://api.gelato.com/v1/products', {
            headers: { 'X-API-KEY': GELATO_API_KEY }
        });
        const gelatoData = await gelatoRes.json();
        const gelatoProducts = gelatoData.products || [];

        // 2. Fetch ALL Supabase Products
        const { data: dbProducts, error } = await supabase.from('products').select('*');
        if (error) throw error;

        const results = [];

        // 3. Match and Update
        for (const gProd of gelatoProducts) {
            // Find database product with matching Title (case-insensitiveish)
            const match = dbProducts.find((dbP) =>
                dbP.title.trim().toLowerCase() === gProd.title.trim().toLowerCase()
            );

            if (match) {
                // Update the DB product with the External ID and Fresh Image
                const { error: updateError } = await supabase
                    .from('products')
                    .update({
                        external_id: gProd.id,
                        image_url: gProd.preview_url,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', match.id);

                results.push({
                    title: gProd.title,
                    status: updateError ? 'Failed' : 'Linked & Updated',
                    details: updateError?.message
                });
            } else {
                results.push({
                    title: gProd.title,
                    status: 'Skipped',
                    details: 'No matching product found in Supabase'
                });
            }
        }

        return NextResponse.json({
            success: true,
            summary: `Processed ${gelatoProducts.length} Gelato products`,
            results
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
