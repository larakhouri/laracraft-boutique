import React from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
export default async function AtelierPage() {
    // 1. Safety Check for Translations
    let t: (key: string) => string;
    try {
        t = await useTranslations('Atelier');
    } catch (e) {
        // Fallback if translation file is broken
        t = (key: string) => key === 'title' ? 'The Atelier' : 'Handmade creations';
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) { },
            },
        }
    )

    // 2. Fetch Real Products
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', 'atelier')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Supabase Error:", error);
        return <div className="py-24 text-center text-red-500">Unable to load gallery.</div>;
    }

    return (
        <main className="min-h-screen w-full bg-[#fdfcf8] px-6 md:px-12 lg:px-24 py-24">

            {/* Header */}
            <div className="flex flex-col items-center justify-center mb-16 space-y-4 text-center">
                <Sparkles className="w-8 h-8 text-[#004d4d] stroke-[1.5]" />
                <h1 className="font-serif text-4xl md:text-5xl text-[#004d4d] tracking-tight">
                    {t('title')}
                </h1>
                <p className="font-serif italic text-stone-500 text-lg max-w-lg">
                    {t('subtitle')}
                </p>
            </div>

            {/* Grid */}
            {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {products.map((item: any) => {
                        // 3. SAFE DATA HANDLING (Prevents Crashes)
                        // Convert price to number safely
                        const safePrice = item.price ? Number(item.price) : 0;
                        const displayPrice = isNaN(safePrice) ? '0.00' : safePrice.toFixed(2);

                        // Check image existence
                        const hasImage = item.image_url && item.image_url.length > 5;

                        return (
                            <Link key={item.id} href={`/product/${item.id}`} className="group cursor-pointer block">

                                {/* Image Container */}
                                <div className="aspect-[4/5] bg-stone-100 mb-4 overflow-hidden relative rounded-sm">
                                    {hasImage ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title || 'Product'}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-300 italic bg-stone-50">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-[#004d4d]/0 group-hover:bg-[#004d4d]/5 transition-all duration-500" />
                                </div>

                                {/* Text Details */}
                                <div className="text-center space-y-1">
                                    <h3 className="font-serif text-lg text-[#004d4d] group-hover:underline decoration-1 underline-offset-4 decoration-[#004d4d]/30">
                                        {item.title || 'Untitled'}
                                    </h3>
                                    <p className="font-sans text-xs tracking-widest text-stone-500 uppercase">
                                        €{displayPrice}
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-20 opacity-50 font-serif italic text-stone-400">
                    Preparing the collection...
                </div>
            )}
        </main>
    )
}
