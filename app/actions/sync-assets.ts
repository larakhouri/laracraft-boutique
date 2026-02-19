'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function captureAllGelatoImages() {
    const supabase = await createClient()

    // 1. Fetch all products currently using Gelato S3 links (the 403 culprits)
    const { data: products } = await supabase
        .from('products')
        .select('id, image_url')
        .like('image_url', '%gelato-api-live.s3%')

    if (!products || products.length === 0) return { message: "No Gelato links found to capture." }

    const results = []

    for (const product of products) {
        try {
            console.log(`Capturing image for product ${product.id}...`)
            // 2. Download the image file
            const res = await fetch(product.image_url)
            if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`)

            const blob = await res.blob()
            const fileName = `vault/gelato-${product.id}.jpg`

            // 3. Upload to your own Supabase 'products' bucket
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, blob, { upsert: true, contentType: 'image/jpeg' })

            if (uploadError) throw uploadError

            // 4. Get the permanent URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName)

            // 5. Update the database with the permanent link
            const { error: updateError } = await supabase
                .from('products')
                .update({ image_url: publicUrl })
                .eq('id', product.id)

            if (updateError) throw updateError

            results.push(product.id)
            console.log(`Captured ${product.id} -> ${publicUrl}`)
        } catch (e) {
            console.error(`Failed to capture product ${product.id}:`, e)
        }
    }

    revalidatePath('/', 'layout')
    return { success: true, capturedCount: results.length, message: `Captured ${results.length} images.` }
}
