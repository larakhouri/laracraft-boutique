"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Product {
    id: string;
    title: string;
    category_slug: string;
    price: number;
    image_url?: string;
}

interface ProductCardProps {
    product: Product;
    locale: string;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
    const [imgSrc, setImgSrc] = React.useState(product.image_url);

    return (
        <div className="group relative bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm overflow-hidden flex flex-col h-full">
            <Link href={`/${locale}/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-stone-100">
                {product.image_url ? (
                    <Image
                        src={imgSrc || '/placeholder-artisan.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out grayscale-[10%] group-hover:grayscale-0 hover:glow-turquoise"
                        onError={() => setImgSrc('/placeholder-midnight-teal.svg')}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-stone-300 font-serif italic bg-stone-50">
                        No Image
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick View Button (hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 pointer-events-none">
                    <span className="bg-white/90 text-[var(--color-primary)] px-6 py-3 rounded-sm font-serif italic text-lg shadow-lg flex items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        View Details
                    </span>
                </div>
            </Link>

            <div className="p-4 flex flex-col flex-grow justify-between gap-2">
                <div>
                    <span className="text-xs font-sans tracking-[0.2em] uppercase text-stone-400 block mb-1 font-medium">
                        {product.category_slug === 'gallery' ? 'The Lens Gallery' :
                            product.category_slug === 'atelier' ? 'The Atelier' :
                                'Printed Designs'}
                    </span>
                    <h3 className="text-xl font-serif text-stone-800 line-clamp-2 leading-tight">
                        <Link href={`/${locale}/product/${product.id}`} className="hover:text-[var(--color-primary)] transition-colors">
                            {product.title}
                        </Link>
                    </h3>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-stone-100 mt-2">
                    <span className="font-sans font-medium text-lg tracking-wide text-gold">
                        ${product.price.toLocaleString()}
                    </span>
                    {product.category_slug === 'supplies' ? (
                        <Link
                            href={`/${locale}/bespoke?product=${encodeURIComponent(product.title)}`}
                            className="px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] text-[10px] tracking-[0.2em] uppercase hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 rounded-sm"
                        >
                            Request Details
                        </Link>
                    ) : (
                        <Link href={`/${locale}/product/${product.id}`} className="text-xs font-sans uppercase tracking-widest text-stone-500 hover:text-[var(--color-primary)] flex items-center group/btn">
                            Shop <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
