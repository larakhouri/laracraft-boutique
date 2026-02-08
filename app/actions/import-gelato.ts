'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const GELATO_API_KEY = process.env.GELATO_API_KEY
const GELATO_API_URL = 'https://product.gelatoapis.com/v3/stores'
const STORE_ID = process.env.GELATO_STORE_ID

export async function importGelatoProducts() {
    const supabase = await createClient()

    // 1. Fetch all Gallery items first to use for matching
    const { data: galleryItems } = await supabase
        .from('products')
        .select('id, title')
        .eq('category_slug', 'gallery')

    // 🟢 THE AG DEFINITION: Your list of Artisan Formats
    const ARTISAN_FORMATS = [
        "Acrylic Print", "Classic Semi-Glossy Paper Poster", "Museum-Quality Matte Paper",
        "Premium Matte Paper Poster", "Wooden Framed Poster", "Poster with Hanger",
        "Metal Framed Poster", "Framed Canvas", "Foam Landscape", "Foam Portrait",
        "Foam Square", "Aluminum Print", "Wood Prints", "Brushed Aluminum Print", "Fine Art Poster"
    ];

    try {
        const response = await fetch(`${GELATO_API_URL}/${STORE_ID}/products`, {
            headers: { 'X-API-KEY': GELATO_API_KEY as string }
        })
        const data = await response.json()

        for (const product of data.products || []) {
            // 🔍 CHECK: Is this one of the formats we want for the guide?
            const isArtisanFormat = ARTISAN_FORMATS.some(format =>
                product.title.includes(format)
            );

            // 🔍 SEARCH LOGIC: Check if this Gelato product belongs to a Gallery photo
            const parentPhoto = galleryItems?.find(item =>
                product.title.toLowerCase().includes(item.title.toLowerCase())
            )

            const isVariant = !!parentPhoto

            const productData = {
                external_id: product.id,
                title: product.title,
                description: product.description || '',
                // 🟢 CATEGORY SHIFT: Tag specifically for the Guide
                category_slug: isArtisanFormat
                    ? 'printing-guide-example'
                    : (isVariant ? 'gallery-variant' : 'printed-designs'),
                // 🔗 THE LINK: Store the reference to the parent image
                gallery_ref_id: isVariant ? parentPhoto.id : null,
                price: parseFloat(product.price) || 0,
                image_url: product.preview_url || '/placeholders/lara-teal.jpg',
                updated_at: new Date().toISOString()
            }

            await supabase
                .from('products')
                .upsert(productData, { onConflict: 'external_id' })
        }

        revalidatePath('/[locale]/admin/studio', 'page')
        revalidatePath('/[locale]/printed-designs', 'page')
        return { success: true }

    } catch (error) {
        console.error('Import failed:', error)
        return { success: false, error }
    }
}