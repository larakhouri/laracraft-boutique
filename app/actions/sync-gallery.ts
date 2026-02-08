'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const BUCKET_URL = 'https://storage.googleapis.com/laracraft-gallery-2026'

export async function syncGallery() {
    console.log("------------------------------------");
    console.log("🚀 SERVER ACTION: syncGallery START");
    console.log("------------------------------------");
    const supabase = await createClient()

    try {
        const response = await fetch(BUCKET_URL, { cache: 'no-store' })

        if (!response.ok) {
            console.error("FAILED TO REACH BUCKET:", response.status);
            return { success: false, message: "Connection to Google Cloud failed." };
        }

        const textData = await response.text()
        const matches = textData.match(/<Key>(.*?)<\/Key>/g)

        if (!matches) return { success: true, message: 'Cloud bucket is currently empty.' }

        const files = matches.map(tag => tag.replace(/<\/?Key>/g, ''))
        let count = 0

        for (const fullPath of files) {
            // ✅ Fix 1: Added 'i' flag for case-insensitive matching (.JPG vs .jpg)
            if (fullPath.endsWith('/') || !fullPath.match(/\.(jpg|jpeg|png|webp)$/i)) continue

            // ✅ Fix 2: Handle spaces and special characters in filenames
            const encodedPath = fullPath.split('/').map(segment => encodeURIComponent(segment)).join('/')
            const publicUrl = `${BUCKET_URL}/${encodedPath}`

            const parts = fullPath.split('/')
            let folderTag = 'general'
            let filename = fullPath

            if (parts.length > 1) {
                folderTag = parts[0].toLowerCase()
                filename = parts[parts.length - 1]
            }

            // ✅ Fix 3: Clean up titles from filenames like "IMG (2247)"
            const title = filename
                .replace(/\.[^/.]+$/, "")
                .replace(/[-_()]/g, " ")
                .replace(/\b\w/g, l => l.toUpperCase())
                .trim()

            const productData = {
                title: title,
                category_slug: 'gallery',
                price: 0,
                image_url: publicUrl,
                status: 'published',
                tags: [folderTag],
                updated_at: new Date().toISOString(),
            }

            // Upsert: image_url is the unique constraint
            const { error } = await supabase
                .from('products')
                .upsert(productData, { onConflict: 'image_url' })

            if (error) {
                console.error(`❌ Supabase Error for ${filename}:`, error.message)
            } else {
                count++
            }
        }

        revalidatePath('/gallery')
        revalidatePath('/admin/inventory')
        return { success: true, message: `Successfully synced ${count} photos.` }

    } catch (error: any) {
        console.error('Gallery Sync Error:', error)
        return { success: false, message: error.message }
    }
}