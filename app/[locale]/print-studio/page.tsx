import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Scroll } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function PrintStudioPage() {
    const supabase = await createClient()

    // 1. Fetch real products synced from Gelato
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', 'printed-designs')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-[#fdfcf8] pb-24">
            {/* Header: Printed Designs */}
            <div className="w-full pt-32 pb-16 flex flex-col items-center bg-[#fdfcf8]">
                <Scroll className="w-8 h-8 text-[#004d4d]/60 mb-6" strokeWidth={1.5} />

                <h1 className="font-serif text-5xl text-stone-900 mb-4 tracking-tight">
                    Printed Designs
                </h1>

                <p className="font-serif italic text-stone-500 text-lg tracking-wide text-center max-w-xl mx-auto">
                    Curated artisan creations, captured on premium lifestyle essentials.
                </p>
            </div>

            {/* Catalog Grid */}
            <div className="w-full px-12 md:px-32 mt-16">
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((item) => (
                            <div key={item.id} className="group bg-white rounded-sm border border-stone-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                                    <Image
                                        src={item.image_url}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="font-serif text-xl text-stone-800 mb-2">{item.title}</h3>
                                    <p className="font-sans text-xs text-stone-500 leading-relaxed mb-4 flex-grow">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-50">
                                        <span className="font-sans text-stone-400 font-medium">
                                            {item.price > 0 ? `$${item.price}` : 'Price on Request'}
                                        </span>
                                        <Link
                                            href={`/bespoke?product=${encodeURIComponent(item.title)}`}
                                            className="w-full ml-4 block py-2 border border-[#2A8B8B] text-[#2A8B8B] text-center text-[10px] tracking-[0.2em] uppercase hover:bg-[#2A8B8B] hover:text-white transition-all duration-300 rounded-sm"
                                        >
                                            Request Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-sm border border-dashed border-stone-200">
                        <p className="text-stone-400 font-serif italic">The collection is currently being curated. Please check back shortly.</p>
                    </div>
                )}
            </div>

            {/* Transition to Bespoke Section */}
            <div className="max-w-4xl mx-auto mt-24 px-4 text-center">
                <div className="py-12 border-t border-stone-200">
                    <h3 className="font-serif text-3xl text-stone-800 mb-6 italic">Beyond the Design</h3>
                    <p className="text-stone-500 text-sm max-w-lg mx-auto mb-10 leading-relaxed">
                        While our printed collection features curated artisan designs, true personalization happens through our bespoke service. For custom photography, specific colorways, or exclusive paper stocks, let's collaborate directly.
                    </p>
                    <Link href="/bespoke" className="inline-block">
                        <Button
                            variant="outline"
                            className="border-[#2A8B8B] text-[#2A8B8B] hover:bg-[#2A8B8B] hover:text-white uppercase tracking-widest text-xs px-10 py-7 h-auto"
                        >
                            Start A Bespoke Commission
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}