import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { Sprout } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ArtisanHero from '@/components/ArtisanHero';

// 🛡️ PRO MODE: Server Components are dynamic by default in Next.js 15+
export default async function AtelierPage() {
    const supabase = await createClient();

    // 🟢 DATA FETCHING: Happens directly on the server
    const { data: products } = await supabase
        .from('atelier_products')
        .select('*')
        .order('updated_at', { ascending: false });

    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">
            {/* 🏺 Standardized Hero Component */}
            <ArtisanHero
                title="The Atelier"
                subtitle="Where Artisan Visions Take Shape"
                Icon={Sprout}
            />

            <div className="max-w-[1800px] mx-auto px-6 py-24 animate-in fade-in duration-1000">
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                        {products.map((item) => (
                            <Link
                                key={item.id}
                                href={`/product/${item.id}`}
                                className="group block"
                            >
                                <div className="relative aspect-[4/5] bg-white rounded-sm shadow-sm border border-stone-200 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title || "Artisan Work"}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 text-stone-300">
                                            <Sprout strokeWidth={1} className="w-6 h-6 mb-2 opacity-20" />
                                            <span className="text-[9px] uppercase tracking-widest italic">Awaiting Visual</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 text-center space-y-1">
                                    <h3 className="font-serif text-lg text-[#003D4D] group-hover:text-stone-600 transition-colors">
                                        {item.title || 'Untitled Work'}
                                    </h3>
                                    <div className="w-8 h-[1px] bg-[#003D4D]/20 mx-auto transition-all duration-500 group-hover:w-1/2" />
                                    <p className="text-[10px] tracking-widest text-stone-400 uppercase mt-2">
                                        €{item.price ? Number(item.price).toFixed(2) : "0.00"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-40 font-serif italic text-[#003D4D]">
                        The Atelier is currently being curated.
                    </div>
                )}
            </div>
        </main>
    );
}