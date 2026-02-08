'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Camera, Printer, Package, Sparkles } from 'lucide-react'

export function CategoryShowcase() {
    const t = useTranslations('Categories')
    const params = useParams()
    const locale = params.locale as string

    const categories = [
        {
            id: 'atelier',
            icon: Sparkles,
            title: t('atelier'),
            desc: 'Handmade Gifts & Curated Goods',
            href: '/shop', // Updated to match /shop from navigation.ts
            color: 'bg-stone-100'
        },
        {
            id: 'gallery',
            icon: Camera,
            title: t('gallery'),
            desc: 'Fine Art Photography Prints',
            href: '/gallery',
            color: 'bg-stone-50'
        },
        {
            id: 'printing',
            icon: Printer,
            title: t('printing'),
            desc: 'Bespoke Print on Demand',
            href: '/print-studio', // Updated to match /print-studio
            color: 'bg-stone-100'
        },
        {
            id: 'supplies',
            icon: Package,
            title: t('supplies'),
            desc: 'Essentials for Creators',
            href: '/inventory',
            color: 'bg-stone-50'
        }
    ]

    return (
        <section className="w-full py-24 bg-[#fdfcf8] px-6 md:px-12 lg:px-24">
            {/* Section Title */}
            <div className="text-center mb-16 space-y-2">
                <h2 className="font-serif text-3xl md:text-4xl text-[#004d4d]">
                    Explore LaraCraft
                </h2>
                <div className="w-16 h-0.5 bg-[#004d4d]/20 mx-auto" />
            </div>

            {/* The 4 Doors (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/${locale}${cat.href}`}
                        className="group relative flex flex-col items-center text-center p-8 rounded-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#004d4d]/10 bg-white"
                    >
                        {/* Hover Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#004d4d] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                        {/* Icon */}
                        <div className="mb-6 p-4 rounded-full bg-[#fdfcf8] group-hover:bg-[#004d4d]/5 transition-colors">
                            <cat.icon className="w-8 h-8 text-[#004d4d] stroke-[1.5]" />
                        </div>

                        {/* Text */}
                        <h3 className="font-serif text-xl text-[#004d4d] mb-2">
                            {cat.title}
                        </h3>
                        <p className="font-sans text-xs uppercase tracking-widest text-stone-500 group-hover:text-[#004d4d] transition-colors">
                            {cat.desc}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    )
}
