"use client"; // 🟢 Mandatory for interactivity

import { Camera, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function GalleryMasonry({ initialPhotos }: { initialPhotos: any[] | null }) {
    // Standardizing your 6 local photo paths as the primary source
    const localPhotos = [
        "/images/gallery/photo1.jpg",
        "/images/gallery/photo2.jpg",
        "/images/gallery/photo3.jpg",
        "/images/gallery/photo4.jpg",
        "/images/gallery/photo5.jpg",
        "/images/gallery/photo6.jpg"
    ];

    // Combine Supabase data with local files if needed
    const displayPhotos = (initialPhotos && initialPhotos.length > 0)
        ? initialPhotos.map(p => p.image_url)
        : localPhotos;

    return (
        <section className="py-24 px-6 max-w-[1600px] mx-auto bg-[#F8F6F1]">
            <div className="flex items-end justify-between mb-12 border-b border-stone-200 pb-4">
                <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-[#003D4D]" />
                    <h3 className="text-4xl font-serif italic text-[#003D4D]">The Lens Gallery</h3>
                </div>
                <Link href="/gallery" className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold flex items-center gap-2 hover:text-[#003D4D] transition-colors">
                    Access Archive <ArrowUpRight className="w-3 h-3" />
                </Link>
            </div>

            {/* 🟢 MASONRY LAYOUT: This respects the photos' natural shapes */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {displayPhotos.map((src, index) => (
                    <div key={index} className="break-inside-avoid relative group overflow-hidden bg-stone-100 shadow-sm transition-all hover:shadow-xl">
                        <img
                            src={src}
                            alt={`Gallery Artifact ${index + 1}`}
                            className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}