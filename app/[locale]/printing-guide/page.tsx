import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ArtisanHero from '@/components/ArtisanHero';

export default async function PrintingGuidePage() {
    const supabase = await createClient();

    // Fetch only from the dedicated guide table
    const { data: guideItems } = await supabase
        .from('printing_guide')
        .select('*')
        .order('updated_at', { ascending: true });

    return (
        <main className="min-h-screen w-full bg-[#FDFCF8] selection:bg-[#C5A059]/30">
            <ArtisanHero
                title="Printing Guide"
                subtitle="Select a Masterpiece to Configure Dimensions"
                Icon={BookOpen}
            />

            <div className="max-w-[1400px] mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {guideItems?.map((item, index) => (
                        <Link
                            key={item.id}
                            href={`/printing-guide/${item.id}`}
                            className="group block"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-white border border-stone-200 p-4 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                                <img
                                    src={item.image_url || ''}
                                    alt={item.title || ''}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute top-8 left-8 w-10 h-10 bg-[#003D4D] text-white rounded-full flex items-center justify-center font-serif italic shadow-xl z-10 border border-[#C5A059]/30">
                                    {index + 1}
                                </div>
                            </div>
                            <div className="mt-8 text-center space-y-2">
                                <h3 className="font-serif text-2xl text-[#003D4D]">{item.title}</h3>
                                <div className="flex items-center justify-center gap-2 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Configure Dimensions</span>
                                    <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}