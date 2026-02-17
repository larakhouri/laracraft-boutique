'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(id: string, vault: string) {
    const supabase = await createClient()

    // Determine target table based on vault
    let targetTable = 'products'
    if (vault === 'atelier') targetTable = 'atelier_products'
    if (vault === 'supplies') targetTable = 'supplies_products'

    const { error } = await supabase
        .from(targetTable)
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