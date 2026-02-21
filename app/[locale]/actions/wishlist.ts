'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(productId: string) {
    const supabase = await createClient()

    // 1. Get current session
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'You must be logged in to curate artifacts.' }

    // 2. Fetch current wishlist array
    const { data: profile } = await supabase
        .from('profiles')
        .select('wishlist_ids')
        .eq('id', user.id)
        .single()

    let ids = profile?.wishlist_ids || []

    // 3. Toggle logic: Remove if exists, Add if it doesn't
    if (ids.includes(productId)) {
        ids = ids.filter((id: string) => id !== productId)
    } else {
        ids.push(productId)
    }

    // 4. Update the profile in the vault
    const { error } = await supabase
        .from('profiles')
        .update({ wishlist_ids: ids })
        .eq('id', user.id)

    if (error) return { error: error.message }

    // 5. Refresh the UI
    revalidatePath('/', 'layout')
    return { success: true, action: ids.includes(productId) ? 'added' : 'removed' }
}