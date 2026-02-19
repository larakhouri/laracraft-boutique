'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper: Downloads from Gelato (Temporary) -> Uploads to Supabase (Permanent)
async function captureToVault(gelatoUrl: string, productId: string) {
    const supabase = await createClient()
    const res = await fetch(gelatoUrl)
    const blob = await res.blob()
    const fileName = `vault/gelato-${productId}.jpg`

    // Upload to your permanent storage bucket
    await supabase.storage.from('products').upload(fileName, blob, { upsert: true })

    // Return the link that will NEVER expire
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
    return publicUrl
}

export async function syncAllArtisanVaults() {
    const supabase = await createClient()

    // Ensure these IDs are set in your .env.local
    const vaults = [
        { id: process.env.GELATO_STORE_ID_GALLERY, table: 'gallery_products' }, // 👈 Target reached
        { id: process.env.GELATO_STORE_ID_PRINTS, table: 'printed_designs' },
        { id: process.env.GELATO_STORE_ID_GUIDE, table: 'printing_guide' },
        { id: process.env.GELATO_STORE_ID_GIFTS, table: 'FinalGifts' },
        { id: process.env.GELATO_STORE_ID_SUPPLIES, table: 'supplies' }
    ]

    for (const vault of vaults) {
        if (!vault.id) continue;
        console.log(`Syncing store ${vault.id} to ${vault.table}...`)

        try {
            const res = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${vault.id}/products`, {
                headers: { 'X-API-KEY': process.env.GELATO_API_KEY! }
            })

            if (!res.ok) {
                console.error(`Failed to fetch store ${vault.id}: ${res.statusText}`)
                continue
            }

            const data = await res.json()
            const products = data.products || []

            for (const p of products) {
                try {
                    // 🟢 Capture to Supabase Storage (Eternal Fix for 403s)
                    const permanentUrl = await captureToVault(p.previewUrl, p.id)

                    await supabase.from(vault.table).upsert({
                        id: p.id,
                        title: p.productName,
                        image_url: permanentUrl,
                        price: p.price, // Ensure price is synced if available
                        updated_at: new Date().toISOString()
                    })
                    console.log(`Synced ${p.id} to ${vault.table}`)
                } catch (err) {
                    console.error(`Failed to sync product ${p.id}:`, err)
                }
            }
        } catch (error) {
            console.error(`Error syncing store ${vault.id}:`, error)
        }
    }
    revalidatePath('/', 'layout')
}
