'use client'
import React from 'react'
import { createClient } from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import { ProductSkeleton } from '@/components/ui/ProductSkeleton'
import { Link } from '@/app/navigation' // 🟢 Added this
import { useParams } from 'next/navigation' // 🟢 Added this

export default function ArtisanGrid() {
    const t = useTranslations('PrintingGuide');
    const { locale } = useParams(); // 🟢 Get current locale (en, de, etc)
    const supabase = createClient();
    const [materials, setMaterials] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchMaterials() {
            const { data } = await supabase
                .from('printing_guide')
                .select('*')
                .order('price', { ascending: true });

            if (data) setMaterials(data);
            setLoading(false);
        }
        fetchMaterials();
    }, []);

    return (
        <section className="px-6 md:px-12 lg:px-24 py-20 bg-white">
            <div className="max-w-[1800px] mx-auto">
                {/* ... Narrative Section Stay Same ... */}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                        {[...Array(3)].map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 animate-in fade-in duration-1000">
                        {materials.map((item) => (
                            /* 🟢 WRAPPED IN LINK: This makes the card functional */
                            <Link
                                key={item.id}
                                href={`/gallery/print-guide/${item.id}`}
                                className="group space-y-6 block cursor-pointer"
                            >
                                <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden border border-stone-100 shadow-sm transition-all duration-700 group-hover:shadow-xl">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-serif text-xl text-[#003D4D]">{item.title}</h3>
                                    <p className="text-[10px] tracking-[0.2em] text-[#C5A059] font-bold uppercase">
                                        Starting at {item.price}€
                                    </p>
                                    <p className="text-sm text-stone-500 leading-relaxed max-w-sm">
                                        Bespoke format curated for archival permanence and visual depth.
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}