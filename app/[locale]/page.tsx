import { createClient } from '@/utils/supabase/server'
import { Link } from '@/i18n/routing'
import { ArrowRight, Layers, Crosshair, Wrench, Sparkles } from 'lucide-react'
import GalleryMasonry from '@/components/gallery/GalleryMasonry'

export default async function HomePage() {
    const supabase = await createClient()

    // 1. Fetch Atelier Products
    const { data: atelierProducts } = await supabase
        .from('atelier_products')
        .select('image_url, title')
        .order('updated_at', { ascending: false })
        .limit(4)

    // 2. Fetch Gallery Data
    const { data: galleryPhotos } = await supabase
        .from('gallery_products')
        .select('image_url, title')
        .order('created_at', { ascending: false })
        .limit(6)

    return (
        <main className="min-h-screen bg-[#F8F6F1]">

            {/* --- SECTION 1: HERO (LaraCraft Branding) --- */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
                <div className="absolute inset-0 z-0">
                    <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60">
                        <source src="/Videos/Bespoke.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#F8F6F1]" />
                </div>
                <div className="relative z-10 text-center space-y-8 px-6">
                    <h1 className="text-6xl md:text-9xl font-serif italic text-white tracking-tighter">
                        LaraCraft
                    </h1>
                    <p className="max-w-xl mx-auto text-[10px] md:text-xs uppercase tracking-[0.6em] text-white font-bold leading-loose">
                        Where Your Ideas Become Gifts
                    </p>
                </div>
            </section>

            {/* --- SECTION 2: THE EVOLUTION MANIFESTO --- */}
            <section className="py-32 px-8 bg-white border-y border-stone-100 text-center">
                <div className="max-w-4xl mx-auto space-y-12">
                    <Layers className="w-8 h-8 text-[#003D4D] opacity-40 mx-auto" />
                    <h2 className="text-3xl md:text-4xl font-serif italic text-[#003D4D]">The Evolution of the Atelier</h2>
                    <p className="text-lg md:text-2xl font-serif leading-relaxed text-stone-600 italic">
                        I am a maker driven by a simple truth: I have more ideas than the day has hours.
                    </p>
                    <div className="h-px w-24 bg-stone-300 mx-auto" />
                </div>
            </section>

            {/* --- SECTION 3: THE ATELIER PILLAR --- */}
            <section className="py-24 px-6 max-w-[1600px] mx-auto">
                <Link href="/the-atelier" className="group block">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {atelierProducts?.map((product, index) => (
                            <div key={index} className="relative aspect-[4/5] overflow-hidden bg-stone-100 shadow-sm">
                                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-end border-b border-stone-200 pb-4">
                        <h3 className="text-4xl font-serif italic text-[#003D4D]">The Atelier</h3>
                        <Crosshair className="w-6 h-6 text-[#003D4D] opacity-20" />
                    </div>
                </Link>
            </section>

            {/* --- SECTION 4: CUSTOM LAB --- */}
            <section className="py-12 px-6 max-w-[1600px] mx-auto">
                <div className="relative w-full aspect-video md:h-[700px] overflow-hidden bg-stone-100 border border-stone-100 shadow-2xl">
                    <video src="/Videos/Bespoke.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
                </div>
                <h3 className="text-4xl font-serif italic text-[#003D4D] mt-8">The Custom Lab</h3>
            </section>

            {/* --- SECTION 5: LENS GALLERY --- */}
            <GalleryMasonry initialPhotos={galleryPhotos} />

            {/* --- SECTION 6: PRINTED DESIGNS (Unified Redirect, Full Bleed Image) --- */}
            <section className="py-24 px-6 max-w-[1600px] mx-auto">
                <Link href="/printed-designs" className="group block">
                    <div className="relative w-full aspect-video md:h-[700px] flex border border-stone-100 bg-white shadow-2xl overflow-hidden">

                        {/* Video 1 (Left) */}
                        <div className="w-1/3 h-full border-r border-stone-100">
                            <video src="/Videos/printedDesign1.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* 🟢 CENTER IMAGE (Full Fill) */}
                        {/* Removed padding (p-12) and centering utilities */}
                        <div className="w-1/3 h-full bg-white group-hover:bg-stone-50 transition-colors overflow-hidden">
                            <img
                                src="/images/Printed.jpg"
                                alt="Printed Designs Gateway"
                                // 🟢 Switched to w-full h-full object-cover for full bleed fill
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>

                        {/* Video 2 (Right) */}
                        <div className="w-1/3 h-full border-l border-stone-100">
                            <video src="/Videos/printedDesign2.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-4xl font-serif italic text-[#003D4D]">Printed Designs</h3>
                    </div>
                </Link>
            </section>

            {/* --- STUDIO UTILITIES --- */}
            <section className="py-24 px-6 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                <Link href="/supplies" className="group block">
                    <div className="relative h-[400px] flex items-center justify-center bg-white border border-stone-100 transition-colors group-hover:bg-[#003D4D]/5">
                        <Wrench className="w-12 h-12 text-[#003D4D] opacity-10" />
                    </div>
                    <h3 className="text-2xl font-serif italic text-[#003D4D] mt-4">Artist's Supplies</h3>
                </Link>
                <Link href="/final-gift" className="group block">
                    <div className="relative h-[400px] flex items-center justify-center bg-[#003D4D] transition-colors group-hover:bg-[#002a35]">
                        <Sparkles className="w-12 h-12 text-white opacity-20" />
                    </div>
                    <h3 className="text-2xl font-serif italic text-[#003D4D] mt-4">Final Gift</h3>
                </Link>
            </section>

            <footer className="py-24 border-t border-stone-100 text-center">
                <p className="text-[9px] uppercase tracking-[0.8em] text-stone-300 font-bold">
                    LaraCraft Studio &copy; 2026
                </p>
            </footer>
        </main>
    )
}