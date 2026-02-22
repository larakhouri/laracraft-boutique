import { createClient } from '@/utils/supabase/server'
import { Link } from '@/i18n/routing'
import { ArrowRight, Layers, Crosshair, Smartphone, Wrench, Sparkles } from 'lucide-react'
// 🟢 FIXED PATH: Added the /gallery/ subfolder to match your file system
import GalleryMasonry from '@/components/gallery/GalleryMasonry'

export default async function HomePage() {
    const supabase = await createClient()

    // 1. Fetch Atelier Products (Top Row)
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

            {/* --- SECTION 1: THE STUDIO HERO (Full Color Video) --- */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover opacity-60"
                    >
                        {/* Pointing to your Bespoke.mp4 file */}
                        <source src="/video/Bespoke.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#F8F6F1]" />
                </div>

                <div className="relative z-10 text-center space-y-8 px-6">
                    <h1 className="text-6xl md:text-9xl font-serif italic text-white tracking-tighter animate-fade-in-up">
                        Antigravity
                    </h1>
                    <p className="max-w-xl mx-auto text-[10px] md:text-xs uppercase tracking-[0.6em] text-white font-bold leading-loose">
                        Where Your Ideas Become Gifts
                    </p>
                    <div className="pt-12">
                        <Link href="/the-atelier" className="group relative inline-flex items-center gap-4 px-12 py-5 bg-[#003D4D] text-white text-[10px] uppercase tracking-[0.4em] font-bold overflow-hidden transition-all hover:bg-black">
                            <span>Discover the Atelier</span>
                            <ArrowRight className="w-4 h-4 absolute right-6 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: THE EVOLUTION MANIFESTO --- */}
            <section className="py-32 px-8 bg-white border-y border-stone-100">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <Layers className="w-8 h-8 text-[#003D4D] mx-auto opacity-40" />
                    <h2 className="text-3xl md:text-4xl font-serif italic text-[#003D4D]">The Evolution of the Atelier</h2>
                    <p className="text-lg md:text-2xl font-serif leading-relaxed text-stone-600 italic">
                        I am a maker driven by a simple truth: I have more ideas than the day has hours.
                        Lara Craft Gifts is the home for my overflowing creativity, specializing in high-end
                        epoxy resin artistry.
                    </p>
                    <div className="h-px w-24 bg-stone-300 mx-auto" />
                </div>
            </section>

            {/* --- SECTION 3: THE PILLAR GRID --- */}
            <section className="py-24 px-6 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 gap-x-6 md:gap-x-10">

                    {/* 1. THE ATELIER PILLAR */}
                    <div className="md:col-span-12 group">
                        <Link href="/the-atelier" className="block">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {atelierProducts?.map((product, index) => (
                                    <div key={index} className="relative aspect-[4/5] overflow-hidden bg-stone-100 shadow-sm">
                                        <img
                                            src={product.image_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-end border-b border-stone-200 pb-4">
                                <h3 className="text-4xl font-serif italic text-[#003D4D]">The Atelier</h3>
                                <Crosshair className="w-6 h-6 text-[#003D4D] opacity-20" />
                            </div>
                        </Link>
                    </div>

                    {/* 2. THE CUSTOM LAB (Autoplaying Bespoke Video) */}
                    <div className="md:col-span-7 group">
                        <Link href="/bespoke" className="block">
                            <div className="relative h-[600px] overflow-hidden bg-stone-100 border border-stone-100 group-hover:border-[#003D4D]/30 transition-all">
                                <video
                                    src="/video/Bespoke.mp4"
                                    autoPlay muted loop playsInline
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-2xl font-serif italic text-[#003D4D] mt-4">The Custom Lab</h3>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500 max-w-sm">Legacy preservation and unique commissions.</p>
                        </Link>
                    </div>

                    {/* 3. PRINTED DESIGNS */}
                    <div className="md:col-span-5 group">
                        <Link href="/printed-designs" className="block">
                            <div className="relative h-[600px] overflow-hidden bg-stone-100">
                                <div className="absolute inset-0 w-full h-full flex">
                                    <video src="/Videos/printedDesign1.mp4" autoPlay muted loop playsInline className="w-1/2 h-full object-cover" />
                                    <video src="/Videos/printedDesign2.mp4" autoPlay muted loop playsInline className="w-1/2 h-full object-cover border-l border-white/20" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif italic text-[#003D4D] mt-4">Printed Designs</h3>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500">Everyday art and tech variants.</p>
                        </Link>
                    </div>

                </div>
            </section>

            {/* --- SECTION 4: THE LENS GALLERY (Fixed Masonry Integration) --- */}
            {/* Using the component found in /components/gallery/ */}
            <GalleryMasonry initialPhotos={galleryPhotos} />

            {/* --- SECTION 5: FINAL PILLARS --- */}
            <section className="py-24 px-6 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                <Link href="/supplies" className="group block">
                    <div className="relative h-[400px] flex items-center justify-center bg-white border border-stone-100 transition-colors group-hover:bg-[#003D4D]/5">
                        <Wrench className="w-12 h-12 text-[#003D4D] opacity-10 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <h3 className="text-2xl font-serif italic text-[#003D4D] mt-4">Artist's Supplies</h3>
                </Link>
                <Link href="/final-gift" className="group block">
                    <div className="relative h-[400px] flex items-center justify-center bg-[#003D4D] transition-colors group-hover:bg-[#002a35]">
                        <Sparkles className="w-12 h-12 text-white opacity-20 group-hover:opacity-50 transition-opacity" />
                    </div>
                    <h3 className="text-2xl font-serif italic text-[#003D4D] mt-4">Final Gift</h3>
                </Link>
            </section>

            <footer className="py-24 border-t border-stone-100 text-center">
                <p className="text-[9px] uppercase tracking-[0.8em] text-stone-300 font-bold">
                    Antigravity Project &copy; 2026 / Lara Craft Studio
                </p>
            </footer>
        </main>
    )
}