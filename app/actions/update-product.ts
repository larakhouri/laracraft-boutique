'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProduct(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const price = formData.get('price') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const description_ar = formData.get('description_ar') as string
    const status = formData.get('status') as string

    // 1. Prepare the Update Object
    const updates: any = {
        title,
        price: parseFloat(price),
        category_slug: category,
        description,
        description_ar,
        status,
        updated_at: new Date().toISOString(),
    }

    // 2. Handle Image Update (Only if a new file is chosen)
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
        // Upload new image
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('products') // Make sure this bucket exists
            .upload(filename, imageFile)

        if (!uploadError) {
            // Get Public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('products')
                .getPublicUrl(filename)

            updates.image_url = publicUrl
        }
    }

    // 3. Update Database
    const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)

    if (error) {
        console.error('Update Error:', error)
        return { message: 'Failed to update product' }
    }

    // 4. Refresh Cache & Redirect
    revalidatePath('/inventory')
    revalidatePath('/atelier')
    revalidatePath('/gallery')
    revalidatePath(`/product/${id}`)

    redirect('/admin/studio') // Or back to inventory
}
