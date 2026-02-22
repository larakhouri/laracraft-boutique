import React from 'react'
import { createClient } from '@/utils/supabase/server'
import WishlistGrid from './WishlistArchive'

export default async function WishlistDataFetcher() {
    const supabase = await createClient();

    // 1. Authenticate the User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="py-20 text-center text-stone-400 font-serif italic border border-dashed border-stone-200">
                Please authenticate to view your curated archive.
            </div>
        );
    }

    // 2. Fetch the Array of Saved IDs
    const { data: profile } = await supabase
        .from('profiles')
        .select('wishlist_ids')
        .eq('id', user.id)
        .single();

    // 🟢 Fix: Explicitly type as string array
    const ids: string[] = profile?.wishlist_ids || [];

    if (ids.length === 0) {
        return <WishlistGrid items={[]} />;
    }

    // 3. The Multi-Vault Search Engine
    const vaults = [
        'atelier_products',
        'products',
        'printed_designs',
        'printing_guide'
    ];

    // 🟢 Fix: Explicitly type (id: string) to satisfy the compiler
    const formattedIds = ids.map((id: string) => `"${id}"`).join(',');

    // 🟢 Fix: Explicitly type (vault: string)
    const searchPromises = vaults.map(async (vault: string) => {
        const { data } = await supabase
            .from(vault)
            .select('id, external_id, title, image_url, price')
            .or(`id.in.(${formattedIds}),external_id.in.(${formattedIds})`);

        return data || [];
    });

    const results = await Promise.all(searchPromises);
    const allFoundItems = results.flat();

    // 4. Remove any duplicates
    // 🟢 Fix: Explicitly type (item: any)
    const uniqueItems = Array.from(
        new Map(allFoundItems.map((item: any) => [item.id || item.external_id, item])).values()
    );

    // 5. Render the UI
    return <WishlistGrid items={uniqueItems} />;
}