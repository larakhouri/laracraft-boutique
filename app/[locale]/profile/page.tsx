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

    const safeProfile = profile || { id: user.id, full_name: user.email, wishlist_ids: [] }

    // Fetch Orders
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // 🟢 MULTI-VAULT WISHLIST ENGINE
    const wishlistIds = safeProfile.wishlist_ids || [];
    let completeWishlist: any[] = [];

    if (wishlistIds.length > 0) {
        // We check every vault where a product could live
        const vaults = [
            'gallery_products',
            'printed_designs',
            'atelier_products',
            'products',
            'printing_guide'
        ];

        // Format IDs for Supabase string matching
        const formattedIds = wishlistIds.map((id: string) => `"${id}"`).join(',');

        // Search all tables simultaneously for maximum speed
        const searchPromises = vaults.map(async (vault) => {
            const { data } = await supabase
                .from(vault)
                .select('*')
                .or(`id.in.(${formattedIds}),external_id.in.(${formattedIds})`);
            return data || [];
        });

        const results = await Promise.all(searchPromises);

        // Flatten the array and remove any accidental duplicates
        const allFound = results.flat();
        const uniqueItems = new Map();
        allFound.forEach(item => uniqueItems.set(item.id || item.external_id, item));
        completeWishlist = Array.from(uniqueItems.values());
    }

    return (
        <main className="min-h-screen bg-[#fdfcf8] pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="font-serif text-4xl italic text-[#004d4d] mb-12">Your Sanctum</h1>
                <ProfileClientView
                    profile={safeProfile}
                    orders={orders || []}
                    wishlist={completeWishlist}
                />
            </div>
        </main>
    )
}