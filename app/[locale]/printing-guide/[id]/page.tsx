import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { ChevronLeft, Maximize2, ShieldCheck, Check, Info } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // 🟢 NEXT.JS 15 FIX: Unwrapping the params promise
    const { id } = await params;
    const supabase = await createClient();

    const { data: item, error } = await supabase
        .from('printing_guide')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !item) {
        return <div className="p-20 text-center font-serif text-stone-400">Protocol not found in archives.</div>;
    }

    // 🟢 GELATO DATA RESOLVER
    // Digs through DB columns to find where the variants are stored
    const getVariants = (data: any) => {
        if (!data) return [];
        let parsed = typeof data === 'string' ? JSON.parse(data) : data;
        if (Array.isArray(parsed)) return parsed;
        return parsed.variants || parsed.product?.variants || [];
    };

    const variants = getVariants(item.variants || item.images);

    return (
        <main className="min-h-screen bg-[#FDFCF8] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Back Navigation */}
                <Link href="/printing-guide" className="inline-flex items-center gap-2 text-stone-400 hover:text-[#003D4D] transition-all mb-12 group">
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Back to Guide</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                    {/* Visual Section */}
                    <div className="bg-white p-8 md:p-12 border border-stone-200 shadow-sm sticky top-32 group">
                        <img
                            src={item.image_url || ''}
                            alt={item.title || ''}
                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                    </div>

                    {/* Configuration Section */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-[#C5A059]">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-[11px] uppercase tracking-[0.4em] font-bold">Gelato Certified</span>
                            </div>
                            <h1 className="font-serif text-5xl md:text-6xl text-[#003D4D] leading-tight">
                                {item.title}
                            </h1>
                            <p className="text-stone-500 text-lg leading-relaxed italic">
                                {item.description && item.description !== 'NULL' ? item.description : "Museum-quality execution utilizing archival pigment inks."}
                            </p>
                        </div>

                        {/* DIMENSION SELECTOR */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <Maximize2 className="w-4 h-4 text-[#003D4D]" />
                                    <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#003D4D]">Available Formats</h3>
                                </div>
                                <span className="text-[9px] text-stone-300 uppercase tracking-widest italic">Live Sync Active</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {variants.length > 0 ? variants.map((v: any, i: number) => (
                                    <button
                                        key={i}
                                        className="flex items-center justify-between p-6 border border-stone-100 bg-white hover:border-[#C5A059] hover:shadow-md transition-all text-left group rounded-sm"
                                    >
                                        <div className="space-y-1">
                                            <span className="text-sm font-bold text-[#003D4D] group-hover:text-[#C5A059] transition-colors">
                                                {v.description || v.size || v.name || "Standard Size"}
                                            </span>
                                            <span className="text-[10px] text-stone-400 uppercase tracking-widest block">
                                                {v.attributes?.Paper || "Artisan Matte 200gsm"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-sm font-serif text-[#C5A059]">{v.price || item.price} {v.currency || '€'}</span>
                                            <div className="w-5 h-5 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all">
                                                <Check className="w-3 h-3 text-transparent group-hover:text-white" />
                                            </div>
                                        </div>
                                    </button>
                                )) : (
                                    <div className="p-10 border border-dashed border-stone-200 text-center rounded-sm">
                                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Scanning Inventory...</p>
                                        <p className="text-[9px] text-stone-300 italic mt-1">Check your dashboard sync status if options do not appear.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Technical Specs Footer */}
                        <div className="p-6 bg-[#003D4D] text-[#FDFCF8] rounded-sm space-y-3">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-[#C5A059]" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Antigravity Technical Note</span>
                            </div>
                            <p className="text-xs leading-relaxed opacity-80 font-sans">
                                Each print is produced on-demand to reduce environmental impact.
                                We utilize sustainably sourced solid wood for all framed options.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}