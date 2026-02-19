'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Skeleton } from "@/components/ui/skeleton"

interface GalleryItem {
    id: string
    title: string
    description?: string
    image_url: string
}

export default function GalleryGrid({ items, loading }: { items: GalleryItem[], loading?: boolean }) {
    const params = useParams()
    const locale = params?.locale as string || 'en'

    if (loading) {
        return (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="break-inside-avoid mb-8">
                        <Skeleton className="w-full h-[400px] rounded-sm" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {items.map((image) => (
                <Link
                    key={image.id}
                    href={locale === 'en' ? `/gallery/${image.id}` : `/${locale}/gallery/${image.id}`}
                    className="break-inside-avoid group relative block overflow-hidden bg-stone-200 rounded-sm mb-8"
                >
                    <Image
                        src={image.image_url}
                        alt={image.title}
                        width={800}
                        height={1000}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
                        <p className="text-white font-serif italic text-xl">{image.title}</p>
                        {image.description && (
                            <p className="text-white/80 text-[10px] mt-2 font-sans uppercase tracking-widest">
                                {image.description}
                            </p>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    )
}
