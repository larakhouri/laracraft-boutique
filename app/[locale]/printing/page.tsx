import React from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { useTranslations } from 'next-intl'
import { Printer } from 'lucide-react'
import Link from 'next/link'

export default async function PrintingPage() {
    // 1. Safe Translations
    let t;
    try {
        t = await useTranslations('Printing');
    } catch (e) {
        t = (key: string) => key === 'title' ? 'Print & Paper' : 'Fine art editions.';
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

    // 2. Fetch EXACT Category
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', 'print-and-paper') // <--- Matches the Import Script
        .eq('status', 'published') // Only show published items
        .order('created_at', { ascending: false })

    return (
        <main className="min-h-screen w-full bg-[#fdfcf8] px-6 md:px-12 lg:px-24 py-24">

            {/* Header */}
            <div className="flex flex-col items-center justify-center mb-16 space-y-4 text-center">
                <div className="w-16 h-16 bg-[#004d4d]/5 rounded-full flex items-center justify-center">
                    <Printer className="w-8 h-8 text-[#004d4d] stroke-[1.5]" />
                </div>
                <h1 className="font-serif text-4xl md:text-5xl text-[#004d4d] tracking-tight">
                    {t('title')}
                </h1>
            </div>

            {/* Grid */}
            {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {products.map((item: any) => {
                        const safePrice = item.price ? Number(item.price) : 0;
                        return (
                            <Link key={item.id} href={`/product/${item.id}`} className="group block">
                                <div className="aspect-[3/4] bg-white border border-stone-100 p-4 mb-4 relative shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-full h-full relative overflow-hidden bg-stone-50">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-300">No Preview</div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-serif text-lg text-[#004d4d]">{item.title}</h3>
                                    <p className="text-xs tracking-widest text-stone-500">€{safePrice.toFixed(2)}</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-20 opacity-50 font-serif italic text-stone-400">
                    No prints found in 'print-and-paper'.
                </div>
            )}
        </main>
    )
}
