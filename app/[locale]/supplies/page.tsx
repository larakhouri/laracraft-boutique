'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
// FIX: Imported Briefcase to resolve the ReferenceError
import { Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

const SUPPLIES = [
    {
        id: 's1',
        title: 'Vintage Steel Shears',
        price: 45,
        image: '/product-journal.jpg',
        desc: 'High-carbon steel scissors for precision textile work.'
    },
    {
        id: 's2',
        title: 'Solid Brass Caliper',
        price: 32,
        image: '/product-ring.jpg',
        desc: 'Essential for measuring gemstones and detailed millwork.'
    },
    {
        id: 's3',
        title: 'Artisan Resin Kit',
        price: 65,
        image: '/product-pendant.jpg',
        desc: 'Our proprietary blend of crystal-clear epoxy for jewelry.'
    },
    {
        id: 's4',
        title: 'Gold Leaf Booklet',
        price: 28,
        image: '/<img>.png',
        desc: '24k gold leaf sheets for gilding and embellishment.'
    }
]

export default function SuppliesPage({ params }: { params: { locale: string } }) {
    const t = useTranslations('Navigation');
    const tDiscovery = useTranslations('Discovery');

    return (
        <div className="min-h-screen bg-[#fdfcf8] pb-24">
            {/* Unified Bespoke Header: No white band, Icon centered */}
            <div className="w-full pt-32 pb-16 flex flex-col items-center bg-[#fdfcf8]">
                {/* Icon centered above title like the Bespoke page */}
                <Briefcase className="w-8 h-8 text-[#004d4d]/60 mb-8" strokeWidth={1} />

                <h1 className="font-serif text-5xl text-stone-900 mb-6 tracking-tight text-center">
                    {t('Supplies')}
                </h1>

                {/* Subtitle using the "Curated" italic serif style */}
                <p className="font-serif italic text-stone-500 text-xl tracking-wide text-center max-w-2xl mx-auto px-6">
                    {tDiscovery('supplies_desc')}
                </p>
            </div>

            {/* Catalog Grid - Set to 4 columns to fill the wide interface */}
            <div className="w-full px-12 md:px-32 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {SUPPLIES.map((item) => (
                        <div key={item.id} className="group flex flex-col">
                            {/* Image Container - Pure and Borderless */}
                            <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden mb-6">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[10%] group-hover:grayscale-0"
                                />
                            </div>

                            {/* Product Info - Minimalist Typography */}
                            <div className="flex flex-col flex-grow text-center items-center">
                                <h3 className="font-serif text-2xl text-stone-800 mb-2 font-medium tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="font-serif italic text-stone-400 text-sm leading-relaxed mb-6 max-w-[80%]">
                                    {item.desc}
                                </p>

                                <div className="mt-auto w-full flex flex-col items-center gap-4">
                                    <span className="font-sans text-stone-300 text-xs tracking-[0.2em] uppercase">
                                        ${item.price}
                                    </span>
                                    <Link
                                        href={`/${params.locale}/bespoke?product=${encodeURIComponent(item.title)}`}
                                        className="w-full py-3 border border-stone-200 text-stone-600 text-[10px] tracking-[0.3em] uppercase hover:bg-[#004d4d] hover:text-white hover:border-[#004d4d] transition-all duration-500 rounded-none"
                                    >
                                        Inquire for Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Wholesale Footer */}
                <div className="mt-32 text-center border-t border-stone-100 pt-20">
                    <p className="font-sans text-stone-400 text-[10px] tracking-[0.4em] uppercase mb-6">Wholesale Inquiries</p>
                    <Link href={`/${params.locale}/bespoke`} className="text-[#004d4d] font-serif italic text-2xl hover:text-stone-400 transition-colors duration-500">
                        Collaborate with the Studio
                    </Link>
                </div>
            </div>
        </div>
    )
}
