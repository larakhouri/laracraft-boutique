import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClientView from '../../../components/account/ProfileClientView'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // 🎯 SAFE FETCH: Fallback if profile is missing
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const safeProfile = profile || { id: user.id, full_name: user.email }

    // Fetch Orders
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Fetch Wishlist (Cross-referencing items)
    const { data: wishlist } = await supabase
        .from('gallery_products')
        .select('*')
        .in('id', safeProfile.wishlist_ids || [])

    return (
        <main className="min-h-screen bg-[#fdfcf8] pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="font-serif text-4xl italic text-[#004d4d] mb-12">Your Sanctum</h1>
                <ProfileClientView
                    profile={safeProfile}
                    orders={orders || []}
                    wishlist={wishlist || []}
                />
            </div>
        </main>
    )
}