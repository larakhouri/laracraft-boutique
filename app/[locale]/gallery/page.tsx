'use client'
import React from 'react'
import { createClient } from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import { Camera, ArrowRight } from 'lucide-react'
import GalleryGrid from '@/components/GalleryGrid'
import PrintingGuide from '@/components/gallery/PrintingGuide'
import { Link } from '@/app/navigation'

export default function GalleryPage() {
    const t = useTranslations('PrintingGuide');
    const supabase = createClient();
    const [galleryItems, setGalleryItems] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(async () => {
            // 🟢 ALIGNED SCHEMA: Requesting the exact columns that exist in your new vault
            const { data, error } = await supabase
                .from('gallery_products')
                .select('id, title, description_en, description_de, description_ar, image_url, price, updated_at')
                .order('updated_at', { ascending: false });

            if (error) {
                console.error("Gallery Fetch Error:", error.message);
            } else if (data) {
                setGalleryItems(data);
            }
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">

            {/* 🔵 REFINED BLUE BAND: Thinner & Integrated Guide */}
            <div className="w-full bg-[#003D4D] py-16 px-12 md:px-24 border-b border-[#002b36] animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                <div className="max-w-[1800px] mx-auto flex flex-col items-center justify-center text-center space-y-4">

                    <Camera className="w-6 h-6 text-stone-200/40 stroke-[1.5]" />

                    <div className="space-y-2">
                        <h1 className="font-serif text-5xl md:text-6xl text-white italic leading-tight tracking-tight uppercase">
                            The Lens Gallery
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold opacity-80">
                            Curated Perspectives & Visual Narratives
                        </p>
                    </div>

                    {/* 🏷️ INTEGRATED GUIDE LINK: Thinner & Brighter Style */}
                    <div className="pt-4">
                        <Link
                            href="/gallery/print-guide"
                            className="group flex items-center gap-3 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-500"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-200 font-bold">
                                    {t('heroPrefix')}
                                </span>
                                <span className="h-px w-6 bg-stone-200/50" />
                                <span className="text-[9px] uppercase tracking-[0.2em] text-[#2A8B8B] font-bold">
                                    {t('heroSuffix')}
                                </span>
                            </div>
                            <ArrowRight className="w-3 h-3 text-stone-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 🏺 GALLERY GRID */}
            <div className="max-w-[1800px] mx-auto pt-16 pb-20 px-4 md:px-12 animate-in fade-in duration-1000 delay-500">
                <GalleryGrid items={galleryItems || []} loading={loading} />
            </div>
            <PrintingGuide />
        </main>
    );
}