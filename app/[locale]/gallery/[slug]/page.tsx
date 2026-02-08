import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import InquiryDialog from '@/components/gallery/InquiryDialog' // Replaced by FormatSelector
// import PrintGuideBanner from '@/components/gallery/PrintGuideBanner' // Moved to Layout
// import FormatSelector from '@/components/gallery/FormatSelector' // Moved to View
import GalleryArtifactView from '@/components/gallery/GalleryArtifactView'

export default async function PhotoPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params
    const supabase = await createClient()

    // Fetch the specific photo by ID or slug
    const { data: photo } = await supabase
        .from('products')
        .select('*')
        .eq('id', slug) // Or use a 'slug' column if you've added one
        .single()

    // Fetch variations matching the photo title
    const { data: variations } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', 'gallery-variant') // Look in the hidden bin
        .ilike('title', `%${photo?.title}%`) // Matches "Amethyst Mist - Acrylic", "Amethyst Mist - Wood", etc.
        .neq('id', photo?.id) // Extra safety check

    if (!photo) notFound()

    return (
        <div className="p-8 md:p-24">
            <Link
                href={locale === 'en' ? '/gallery' : `/${locale}/gallery`}
                className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-12 uppercase text-[10px] tracking-widest font-bold"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Chronicle
            </Link>

            <GalleryArtifactView photo={photo} variants={variations || []} />
        </div>
    )
}
