import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { ShoppingBag } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ArtisanHero from '@/components/ArtisanHero';

export default async function FinalGiftPage() {
    const supabase = await createClient();
    const { data: products } = await supabase
        .from('lifestyle_products')
        .select('*')
        .order('updated_at', { ascending: false });

    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">
            <ArtisanHero
                title="Finalize Your Gift"
                subtitle="Artisan essentials for your collection"
                Icon={ShoppingBag}
            />

            <div className="max-w-[1800px] mx-auto px-6 py-24 animate-in fade-in duration-1000">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {products?.map((item) => (
                        <Link key={item.id} href={`/product/${item.id}`} className="group block text-center">
                            <div className="relative aspect-square bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <h3 className="mt-6 font-serif text-lg text-[#003D4D]">{item.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}