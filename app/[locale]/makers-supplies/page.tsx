import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { Brush } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ArtisanHero from '@/components/ArtisanHero';

export default async function MakersSuppliesPage() {
    const supabase = await createClient();
    const { data: products } = await supabase
        .from('supplies_products')
        .select('*')
        .order('updated_at', { ascending: false });

    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">
            <ArtisanHero
                title="Maker Supplies"
                subtitle="Professional tools from my artisan vault"
                Icon={Brush}
            />

            <div className="max-w-[1800px] mx-auto px-6 py-24 animate-in fade-in duration-1000">
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                        {products.map((item) => (
                            <Link key={item.id} href={`/product/${item.id}`} className="group block text-center">
                                <div className="relative aspect-square bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <h3 className="mt-6 font-serif text-lg text-[#003D4D]">{item.title}</h3>
                                <p className="text-[10px] tracking-widest text-stone-400 uppercase mt-2">Professional Gear</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-40 font-serif italic text-[#003D4D]">No supplies currently in the vault.</div>
                )}
            </div>
        </main>
    );
}