'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const GELATO_API_KEY = process.env.GELATO_API_KEY

if (!GELATO_API_KEY) {
    console.error("Missing GELATO_API_KEY")
}

// 1. Fetch Products from Gelato
export async function fetchGelatoProducts() {
    try {
        const response = await fetch('https://api.gelato.com/v2/products', {
            headers: {
                'X-API-KEY': GELATO_API_KEY || '',
                'Content-Type': 'application/json'
            },
            next: { revalidate: 0 } // Always fetch fresh
        })

        if (!response.ok) {
            console.error('Gelato Fetch Error:', response.statusText)
            return []
        }

        const data = await response.json()
        return data.products || []
    } catch (error) {
        console.error('Gelato Fetch Exception:', error)
        return []
    }
}

// Lead Dev Helper: Downloads from Gelato, Uploads to Supabase
async function captureToVault(gelatoUrl: string, productId: string) {
    const supabase = await createClient()

    try {
        // 1. Fetch the image from the temporary link
        const res = await fetch(gelatoUrl)
        const blob = await res.blob()
        const fileName = `gelato/${productId}.jpg`

        // 2. Upload to your own storage (Eternal Vault)
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, blob, { upsert: true })

        if (uploadError) throw uploadError

        // 3. Generate the permanent URL
        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName)

        return publicUrl
    } catch (e) {
        console.error("Capture Failed:", e)
        return gelatoUrl // Fallback to temp URL if upload fails
    }
}

// 2. Sync Single Product (Download -> Upload -> Save)
export async function syncGelatoProduct(product: any, targetVault: 'gallery' | 'printed') {
    const supabase = await createClient()
    const { id, title, previewUrl } = product // Adjust structure based on actual Gelato API response

    if (!previewUrl) {
        return { success: false, error: 'No preview URL found' }
    }

    // Use the capture helper
    const publicUrl = await captureToVault(previewUrl, id)

    try {
        // D. Save to "Atlas" (Database)
        // Mapping "targetVault" to categories
        const category = targetVault === 'gallery' ? 'Fine Art Gallery' : 'Printed Designs'
        const categorySlug = targetVault === 'gallery' ? 'fine-art' : 'printed-designs'

        const { error: dbError } = await supabase
            .from('products')
            .upsert({
                external_id: id,
                title: title || 'Untitled Gelato Draft',
                description: 'Imported from Gelato',
                price: 0, // Placeholder
                image_url: publicUrl, // 👈 The Permanent Link
                category: category,
                category_slug: categorySlug,
                is_published: false, // Default to draft
                provider: 'gelato'
            }, { onConflict: 'external_id' })

        if (dbError) {
            console.error('DB Insert Error:', dbError)
            return { success: false, error: 'Database save failed' }
        }

        revalidatePath('/[locale]/dashboard')
        return { success: true, publicUrl }

    } catch (error: any) {
        console.error('Sync Exception:', error)
        return { success: false, error: error.message }
    }
}
