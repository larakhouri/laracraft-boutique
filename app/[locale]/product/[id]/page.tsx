import React from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link' // Using the stable link
import { ArrowLeft, Tag, Mail } from 'lucide-react'

// This function tells Next.js this page needs an ID to work
export default async function ProductPage({ params }: { params: { id: string, locale: string } }) {
    const { id, locale } = await params
    const cookieStore = await cookies()

    // 1. Setup Supabase
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

    // 2. Fetch the Specific Product
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !product) {
        notFound() // Shows the 404 page if ID is wrong
    }

    // 3. Prepare Data (Language & Price)
    const isArabic = locale === 'ar';
    const title = product.title;
    const description = isArabic
        ? (product.description_ar || product.description) // Fallback to English if Arabic missing
        : product.description;

    const price = product.price ? Number(product.price).toFixed(2) : '0.00';

    // Combine main image + gallery images into one list (removing duplicates)
    const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);
    const uniqueImages = [...new Set(allImages)];

    return (
        <main className="min-h-screen bg-[#fdfcf8] text-[#004d4d]">

            {/* Navbar Placeholder / Back Button */}
            <div className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between pointer-events-none">
                <Link href="/" className="pointer-events-auto bg-white/80 backdrop-blur-md p-3 rounded-full hover:bg-white shadow-sm transition">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row">

                {/* LEFT: Image Gallery (Scrolls) */}
                <div className="w-full lg:w-3/5 bg-stone-100 min-h-[50vh] lg:min-h-screen">
                    {uniqueImages.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            {uniqueImages.map((img, idx) => (
                                <div key={idx} className="relative w-full">
                                    <img
                                        src={img}
                                        alt={`${title} - view ${idx + 1}`}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-screen flex items-center justify-center text-stone-400 italic">
                            No Images Available
                        </div>
                    )}
                </div>

                {/* RIGHT: Product Details (Sticky) */}
                <div className="w-full lg:w-2/5 p-8 lg:p-16 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center bg-[#fdfcf8]">

                    <div className="max-w-md mx-auto w-full space-y-8">
                        {/* Header */}
                        <div className="space-y-2">
                            <span className="text-xs font-sans tracking-[0.2em] uppercase text-stone-400">
                                {product.category_slug || 'Collection'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif leading-tight">
                                {title}
                            </h1>
                            <p className="text-2xl font-sans font-light tracking-wide pt-2">
                                €{price}
                            </p>
                        </div>

                        <hr className="border-stone-200 w-12" />

                        {/* Story */}
                        <div className={`prose prose-stone text-stone-600 leading-relaxed ${isArabic ? 'font-serif text-right' : ''}`}>
                            <p className="text-lg">{description}</p>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4">
                                {product.tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] uppercase tracking-widest border border-stone-200 px-3 py-1 rounded-full text-stone-500 flex items-center gap-1">
                                        <Tag className="w-3 h-3" /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="pt-8">
                            <a
                                href={`mailto:lara@laracraft.com?subject=Inquiry: ${title}`}
                                className="w-full bg-[#004d4d] text-white py-4 rounded-sm uppercase tracking-widest text-xs font-bold hover:bg-[#003333] transition flex items-center justify-center gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                {isArabic ? 'طلب شراء' : 'Inquire to Purchase'}
                            </a>
                            <p className="text-xs text-center text-stone-400 mt-3 font-serif italic">
                                {isArabic ? 'هذه قطعة فنية فريدة' : 'Each piece is unique and handmade.'}
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    )
}
