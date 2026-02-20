import React from 'react'
import { Layers, ArrowLeft } from 'lucide-react' // Added ArrowLeft
import { Link } from '@/app/navigation' // Ensure this is the correct Link import
import ArtisanGrid from './ArtisanGrid'

export default async function PrintingGuidePage() {
    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">

            {/* 🔵 REFINED BLUE BAND: Hero Section */}
            <div className="w-full bg-[#003D4D] py-16 px-12 md:px-24 border-b border-[#002b36] animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                <div className="max-w-[1800px] mx-auto">

                    {/* 🔙 BACK OPTION */}
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors group mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back to Gallery</span>
                    </Link>

                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <Layers className="w-6 h-6 text-stone-200/40 stroke-[1.5]" />

                        <div className="space-y-2">
                            <h1 className="font-serif text-5xl md:text-6xl text-white italic leading-tight tracking-tight uppercase">
                                The Printing Guide
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold opacity-80">
                                Bespoke Formats & Artisan Materials
                            </p>
                        </div>

                        <div className="pt-4 max-w-xl text-stone-300 font-sans text-sm tracking-wide leading-relaxed">
                            <p>Discover the physical canvases available for your commissioned visual narratives. Each format is selected for uncompromising fidelity and archival permanence.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🏺 ARTISAN GRID COMPONENT */}
            <ArtisanGrid />

        </main>
    )
}