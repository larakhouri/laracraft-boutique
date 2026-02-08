'use client'

import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ArrowRight, Hammer, ShoppingBag, Scroll, Image as ImageIcon, Package, Clock, Gem } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

// Mock Data for Verification
const MOCK_PRODUCTS = [
    {
        id: '1',
        title: 'Hand-Hammered Gold Ring',
        category: 'Bespoke Atelier',
        price: 1250,
        image_url: '/product-ring.jpg'
    },
    {
        id: '2',
        title: 'Bespoke Turquoise Pendant',
        category: 'LaraCraft Originals',
        price: 890,
        image_url: '/product-pendant.jpg'
    },
    {
        id: '3',
        title: 'Artisan Leather Journal',
        category: 'Print & Paper Studio',
        price: 120,
        image_url: '/product-journal.jpg'
    },
    {
        id: '4',
        title: 'Vintage Brass Caliper',
        category: 'Maker Supplies',
        price: 45,
        image_url: ''
    }
]

function ShopContent() {
    const t = useTranslations('Navigation');
    const tDiscovery = useTranslations('Discovery');
    const [products, setProducts] = useState<any[]>(MOCK_PRODUCTS)
    const [loading, setLoading] = useState(false)
    const params = useParams()
    const locale = params.locale as string
    const pathname = usePathname();

    // Filter MOCK_PRODUCTS to show only "LaraCraft Originals" or generic shop items on the main Shop page
    const displayProducts = products.filter(p => p.category !== 'Bespoke_Portal');

    return (
        <div className="min-h-screen bg-[#fdfcf8] pb-24">
            {/* Bespoke Header: Atelier */}
            <div className="w-full pt-32 pb-16 flex flex-col items-center bg-[#fdfcf8]">
                <Gem className="w-8 h-8 text-[#004d4d]/60 mb-6" strokeWidth={1.5} />
                <h1 className="font-serif text-5xl text-stone-900 mb-4 tracking-tight">{t('Atelier')}</h1>
                <p className="font-serif italic text-stone-500 text-lg tracking-wide text-center max-w-xl mx-auto">
                    Curated artifacts and bespoke commissions
                </p>
            </div>

            {/* Category Highlights Removed to dedicated pages */}
            <div className="mb-12" />

            <div className="w-full px-12 md:px-32">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="font-serif text-3xl text-stone-800">LaraCraft Originals</h2>
                    <div className="h-px bg-stone-200 flex-grow" />
                </div>

                {/* Product Grid: 1 col mobile, 2 col sm, 4 col lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} locale={locale} />
                    ))}
                </div>

                {displayProducts.length === 0 && (
                    <div className="text-center py-20 text-stone-400 font-serif italic">
                        No artifacts currently available.
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center"><Clock className="w-10 h-10 text-stone-300 animate-spin" /></div>}>
            <ShopContent />
        </Suspense>
    )
}
