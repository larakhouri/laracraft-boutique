'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const PRINTIFY_BASE_URL = 'https://api.printify.com/v1'
const SHOP_ID = process.env.PRINTIFY_SHOP_ID
const API_TOKEN = process.env.PRINTIFY_API_TOKEN

export async function syncPrintifyProducts() {
    if (!SHOP_ID || !API_TOKEN) {
        console.error('Missing Printify credentials')
        return { error: 'Missing Printify credentials' }
    }

    try {
        // 1. Fetch from Printify
        const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${SHOP_ID}/products.json`, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Printify API error: ${response.statusText}`)
        }

        const data = await response.json()
        const printifyProducts = data.data || []

        const supabase = await createClient()

        // 2. Map and Upsert
        let count = 0
        for (const item of printifyProducts) {
            // Find the first visible image. Printify images structure is complex, 
            // but typically 'images' array has valid objects. 
            // We'll simplisticly take the first one or a default placeholder if needed.
            // Note: Printify logic often requires getting published images specifically, 
            // but for simplicity we take the first available image from the product data.
            const imageUrl = item.images?.[0]?.src || ''

            const productData = {
                title: item.title,
                description: item.description,
                // Price in Printify is usually in cents (integer). We need dollars.
                // 'price' field might be on variants. 
                // Strategy: Take the lowest price from variants as the base price.
                price: item.variants ? Math.min(...item.variants.map((v: any) => v.price)) / 100 : 0,
                category: 'POD' as const, // Force cast to enum type if needed, or string matches
                image_url: imageUrl,
                external_id: String(item.id),
                updated_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('products')
                .upsert(productData, { onConflict: 'external_id' })

            if (error) {
                console.error(`Failed to sync product ${item.id}:`, error)
            } else {
                count++
            }
        }

        revalidatePath('/inventory')
        revalidatePath('/') // Update shop gallery too

        return { message: `Successfully synced ${count} products from Printify.` }

    } catch (error: any) {
        console.error('Sync failed:', error)
        return { error: 'Sync failed: ' + error.message }
    }
}
