'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper: Downloads from Gelato (Temporary) -> Uploads to Supabase (Permanent)
async function captureToVault(gelatoUrl: string, productId: string) {
    if (!gelatoUrl) return null;
    const supabase = await createClient()
    try {
        const res = await fetch(gelatoUrl)
        const blob = await res.blob()
        const fileName = `vault/gelato-${productId}.jpg`

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, blob, { upsert: true })

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName)

        return publicUrl
    } catch (e) {
        console.error(`Capture failed for ${productId}:`, e)
        return null;
    }
}

/**
 * 🎯 TARGETED SYNC: Accepts a target vault to sync only what is requested.
 */
export async function syncAllArtisanVaults(target: string = 'all') {
    const supabase = await createClient()

    // 1. Define all possible vaults
    const allVaults = [
        { id: process.env.GELATO_STORE_ID_GALLERY, table: 'gallery_products', key: 'gallery' },
        { id: process.env.GELATO_STORE_ID_PRINTS, table: 'printed_designs', key: 'printed_designs' },
        { id: process.env.GELATO_STORE_ID_GUIDE, table: 'printing_guide', key: 'printing_guide' },
        { id: process.env.GELATO_STORE_ID_GIFTS, table: 'FinalGifts', key: 'final_gifts' },
        { id: process.env.GELATO_STORE_ID_SUPPLIES, table: 'supplies', key: 'supplies' }
    ]

    // 2. 🟢 FILTER LOGIC: If target isn't 'all', only sync the matching vault
    const vaultsToSync = target === 'all'
        ? allVaults
        : allVaults.filter(v => v.key === target || v.table === target);

    for (const vault of vaultsToSync) {
        if (!vault.id) {
            console.warn(`No Store ID found for ${vault.table}. Skipping...`);
            continue;
        }

        console.log(`🚀 SYNCING: ${vault.table} (ID: ${vault.id})`);

        try {
            const res = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${vault.id}/products`, {
                headers: { 'X-API-KEY': process.env.GELATO_API_KEY! }
            })

            if (!res.ok) {
                console.error(`Failed to fetch store ${vault.id}: ${res.statusText}`)
                continue
            }

            const data = await res.json()
            const products = data.products || data.data || []

            for (const p of products) {
                try {
                    const tempUrl = p.previewUrl || p.imageUrl;
                    if (!tempUrl) continue;

                    const permanentUrl = await captureToVault(tempUrl, p.id)
                    if (!permanentUrl) continue;

                    const { error } = await supabase.from(vault.table).upsert({
                        external_id: p.id,
                        title: p.title || p.productName || 'Untitled Design',
                        image_url: permanentUrl,
                        price: p.price || 0,
                        collection_type: vault.table === 'printed_designs' ? 'printed_designs' : 'artisan_asset',
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'external_id' })

                    if (error) console.error(`DB Error in ${vault.table}:`, error.message)
                } catch (err) {
                    console.error(`Product sync error:`, err)
                }
            }
        } catch (error) {
            console.error(`Store sync error:`, error)
        }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function syncGallery(payload: any) {
    const supabase = await createClient()
    const { error } = await supabase.from('gallery_products').upsert({
        ...payload,
        updated_at: new Date().toISOString()
    })

    if (error) return { success: false, error: error.message }
    revalidatePath('/', 'layout')
    return { success: true }
}