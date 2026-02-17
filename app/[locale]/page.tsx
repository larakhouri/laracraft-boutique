'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import { Sprout } from 'lucide-react'
import { Link } from '@/app/navigation'

export default function AtelierPage() {
    const t = useTranslations('Navigation');
    const supabase = createClient();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAtelier() {
            try {
                // Fetching from the newly created dedicated table
                const { data, error } = await supabase
                    .from('atelier_products')
                    .select('*')
                    .order('updated_at', { ascending: false });

                if (error) throw error;
                if (data) setProducts(data);
            } catch (err) {
                console.error('Error loading Atelier:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchAtelier();
    }, [supabase]);

    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">

            {/* 🔵 BLUE BAND HEADER: Standardized height and motion */}
            <div className="w-full bg-[#003D4D] py-16 px-12 md:px-24 border-b border-[#002b36] animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                <div className="max-w-[1800px] mx-auto flex flex-col items-center justify-center text-center space-y-4">
                    <Sprout className="w-5 h-5 text-stone-200/30 stroke-[1.5]" />
                    <div className="space-y-1">
                        <h1 className="font-serif text-5xl md:text-6xl text-white italic leading-tight tracking-tight uppercase">
                            The Atelier
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold opacity-70">
                            Where Artisan Visions Take Shape
                        </p>
                    </div>
                </div>
            </div>

            {/* 🏺 PRODUCT GRID: On Gallery Cream Background */}
            <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-24 animate-in fade-in duration-1000 delay-500">
                {!loading && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                        {products.map((item) => (
                            <Link key={item.id} href={`/product/${item.id}`} className="group block">
                                <div className="relative aspect-[4/5] bg-white rounded-sm shadow-sm border border-stone-200 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">

                                    {/* ✅ FIXED: Prevents empty string src console error */}
                                    {item.image_url && item.image_url.trim() !== "" ? (
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
                ) : !loading && (
                    <div className="text-center py-20 opacity-40 font-serif italic text-[#003D4D]">
                        The Atelier is currently being curated.
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-6 h-6 border-2 border-[#003D4D]/20 border-t-[#003D4D] rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </main>
    )
}