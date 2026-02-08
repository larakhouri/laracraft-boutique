'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete Error:', error)
        return { success: false, message: 'Failed to delete piece.' }
    }

    revalidatePath('/admin/inventory')
    revalidatePath('/gallery')
    return { success: true, message: 'Piece removed from collection.' }
}