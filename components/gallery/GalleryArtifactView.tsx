'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function GalleryArtifactView({ photo, variants }: { photo: any, variants: any[] }) {
    // Default to the main photo, then switch to Gelato mockups on selection
    const [selectedVariant, setSelectedVariant] = useState(variants[0] || null)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left: Dynamic Image Display */}
            <div className="lg:col-span-8 bg-stone-100 rounded-sm overflow-hidden min-h-[600px] flex items-center justify-center relative">
                <Image
                    src={selectedVariant ? selectedVariant.image_url : photo.image_url}
                    alt={photo.title}
                    width={1200}
                    height={1600}
                    className="w-full h-auto object-contain transition-all duration-500 max-h-[80vh]"
                    priority
                />
            </div>

            {/* Right: Bespoke Configurator */}
            <div className="lg:col-span-4 space-y-6">
                <div>
                    <h1 className="text-4xl font-serif italic text-stone-800 mb-2">{photo.title}</h1>
                    <div className="h-px bg-stone-200 w-24 mb-4" />
                    <p className="text-stone-500 text-sm font-serif italic leading-relaxed">{photo.description}</p>
                </div>

                <div className="p-6 border border-stone-200 bg-white space-y-4 shadow-sm">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">Format Selection</label>

                    {variants && variants.length > 0 ? (
                        <select
                            onChange={(e) => setSelectedVariant(variants.find(v => v.id === e.target.value))}
                            className="w-full border border-stone-200 p-3 font-serif focus:border-[#004d4d] outline-none bg-stone-50/50 cursor-pointer text-stone-800"
                            value={selectedVariant?.id || ''}
                        >
                            {variants.map(v => (
                                <option key={v.id} value={v.id}>
                                    {/* Extracts the category name from your 20 products */}
                                    {v.title.split('-').pop()?.trim()}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="p-3 bg-stone-50 border border-stone-100 text-stone-400 text-xs italic">
                            Formats coming soon.
                        </div>
                    )}

                    <div className="flex justify-between items-end pt-4 border-t border-stone-50 mt-6">
                        <p className="text-2xl font-serif text-[#004d4d]">€{selectedVariant?.price || '0.00'}</p>
                        <Button className="bg-[#004d4d] hover:bg-[#003636] text-white px-6 rounded-none h-12 text-xs uppercase tracking-widest font-bold">
                            Inquire to Print
                        </Button>
                    </div>
                </div>

                <div className="pt-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Artifact No.</p>
                    <p className="text-stone-300 font-mono text-xs mt-1">{photo.id.slice(0, 8)}</p>
                </div>
            </div>
        </div>
    )
}
