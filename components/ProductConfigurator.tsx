'use client'

import React, { useState, useMemo } from 'react'
import { Check, Info, Heart, Frame, Maximize, Palette } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function ProductConfigurator({ variants, basePrice, productId, title }: any) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // 🟢 1. INTELLIGENT PARSING: Extracting the "Relational" data from Gelato
    const processedVariants = useMemo(() => {
        if (!variants || !Array.isArray(variants)) return [];

        return variants.map(v => {
            // Brute force search for dimensions in SKU or Attributes
            const sizeMatch = v.sku?.match(/(\d+x\d+)/i)?.[0] ||
                v.attributes?.find((a: any) => a.name.includes('Size'))?.value;

            // Search for Frame Color
            const frameMatch = v.sku?.toLowerCase().includes('black') ? 'Black' :
                v.sku?.toLowerCase().includes('wood') ? 'Natural Wood' :
                    v.sku?.toLowerCase().includes('white') ? 'White' : 'No Frame';

            return {
                ...v,
                displaySize: sizeMatch || "Original",
                displayFrame: frameMatch,
                displayName: sizeMatch ? `${sizeMatch} — ${frameMatch}` : v.title
            }
        });
    }, [variants]);

    // 🟢 2. DYNAMIC FILTERS: Grouping by your 3-table logic
    const uniqueSizes = Array.from(new Set(processedVariants.map(v => v.displaySize)));
    const [selectedSize, setSelectedSize] = useState(uniqueSizes[0]);

    // Filter variants based on selected size to find available frame colors
    const availableFrames = processedVariants.filter(v => v.displaySize === selectedSize);
    const [selectedVariant, setSelectedVariant] = useState(availableFrames[0] || processedVariants[0]);

    const handleSaveToWishlist = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { window.location.href = '/login'; return; }

            const targetId = selectedVariant?.external_id || selectedVariant?.id || productId;
            const { data: profile } = await supabase.from('profiles').select('wishlist_ids').eq('id', user.id).single();
            const currentIds = Array.isArray(profile?.wishlist_ids) ? profile.wishlist_ids : [];

            if (!currentIds.includes(targetId)) {
                await supabase.from('profiles').update({
                    wishlist_ids: [...currentIds, targetId],
                    updated_at: new Date().toISOString()
                }).eq('id', user.id)
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) { console.error(err) } finally { setLoading(false) }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* 3. SIZE SELECTION TILES */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-stone-400 uppercase tracking-widest text-[10px] font-bold">
                    <Maximize className="w-3 h-3" /> Dimensions
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {uniqueSizes.map(size => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`py-3 text-[11px] border transition-all ${selectedSize === size ? 'border-[#003D4D] bg-[#003D4D] text-white' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. FRAME SELECTION TILES */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-stone-400 uppercase tracking-widest text-[10px] font-bold">
                    <Frame className="w-3 h-3" /> Finish / Frame
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {availableFrames.map(v => (
                        <button
                            key={v.id}
                            onClick={() => setSelectedVariant(v)}
                            className={`p-3 text-left border flex justify-between items-center transition-all ${selectedVariant?.id === v.id ? 'border-[#C5A059] ring-1 ring-[#C5A059]' : 'border-stone-200'}`}
                        >
                            <span className="text-[10px] uppercase font-bold">{v.displayFrame}</span>
                            <span className="text-[10px] text-[#C5A059]">€{v.price || basePrice}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 5. ACTION AREA */}
            <div className="pt-6 border-t border-stone-100">
                <button
                    onClick={handleSaveToWishlist}
                    disabled={loading}
                    className={`w-full py-5 text-[10px] uppercase tracking-[0.4em] font-bold transition-all flex items-center justify-center gap-3 ${success ? 'bg-green-800 text-white' : 'bg-[#003D4D] text-white hover:bg-black shadow-xl'
                        }`}
                >
                    {loading ? 'Processing...' : success ? 'Added to Sanctum' : <><Heart className="w-3 h-3" /> Add to Wishlist</>}
                </button>
            </div>
        </div>
    )
}