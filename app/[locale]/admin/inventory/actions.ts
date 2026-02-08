'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    price: z.coerce.number().min(0, 'Price must be positive'),
    category: z.enum(['Bespoke', 'Boutique', 'POD', 'Gallery', 'Supply']),
})

import { ensureStorageBucket } from '@/utils/supabase/storage'

export async function uploadProduct(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Verify Role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated', message: '' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || (profile.role !== 'staff' && profile.role !== 'super_admin')) {
        return { error: 'Unauthorized access', message: '' }
    }

    // 2. Ensure Bucket Exists
    const bucketReady = await ensureStorageBucket('product-images')
    if (!bucketReady) {
        return { error: 'Storage bucket could not be initialized', message: '' }
    }

    // 3. Validate Data
    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
    }

    const validatedFields = productSchema.safeParse(rawData)
    if (!validatedFields.success) {
        return { error: 'Invalid input fields', message: '' }
        // Note: detailed field errors could be returned if the UI supports it, 
        // but simplified here for the specific type matching
    }

    // 4. Handle Image Upload
    const file = formData.get('image') as File
    if (!file || file.size === 0) {
        return { error: 'Image is required', message: '' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

    if (uploadError) {
        return { error: 'App upload failed: ' + uploadError.message, message: '' }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

    // 5. Insert into Database
    const { error: insertError } = await supabase
        .from('products')
        .insert({
            title: validatedFields.data.title,
            description: validatedFields.data.description,
            price: validatedFields.data.price,
            category: validatedFields.data.category,
            image_url: publicUrl,
        })

    if (insertError) {
        return { error: 'DB Insert failed: ' + insertError.message, message: '' }
    }

    revalidatePath('/inventory')
    revalidatePath('/') // Live Sync: Update Boutique Gallery immediately
    redirect('/admin/studio')
}

export async function syncProducts() {
    try {
        const { syncPrintifyProducts } = await import('@/lib/printify/sync')
        await syncPrintifyProducts()
        revalidatePath('/inventory')
        return { success: true, message: 'Products synced!' }
    } catch (e) {
        console.error(e)
        return { success: false, message: 'Sync failed.' }
    }
}
