'use server'

import { createClient } from '@/utils/supabase/server'

export async function importProductsFromCSV(rows: any[]) {
    const supabase = await createClient()
    let successCount = 0;
    let errorCount = 0;

    for (const row of rows) {
        try {
            // 🛠️ Fail-safe logic for your Import Script
            const image_url = row['Print File URL'] || row['Mockup URL'] || '/placeholders/lara-teal.jpg';
            const price = parseFloat(row['Retail Price'] || row['Price'] || '45.00');

            const { error } = await supabase.from('products').upsert({
                title: row['Product Title'],
                category_slug: 'printed-designs', // Defaulting to printed-designs as per request
                image_url: image_url,
                price: isNaN(price) ? 45.00 : price,
                external_id: row['Gelato ID'] || row['Design ID'] || `csv-${Date.now()}-${Math.random()}`,
                updated_at: new Date().toISOString()
            }, { onConflict: 'external_id' });

            if (error) {
                console.error('Row import error:', error);
                errorCount++;
            } else {
                successCount++;
            }
        } catch (e) {
            console.error('Row processing error:', e);
            errorCount++;
        }
    }

    return { success: true, successCount, errorCount };
}
