'use client'

import React from 'react'
import Image from 'next/image'

interface WishlistItem {
    id: string
    title: string
    image_url?: string
    price?: number
}

export default function WishlistGrid({ items }: { items: WishlistItem[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="py-20 text-center border border-dashed border-stone-200 bg-stone-50/50">
                <h3 className="font-serif text-xl italic text-stone-400 mb-2">The Archive is Empty</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Curate your collection to see artifacts here.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {items.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                    <div className="aspect-[4/5] bg-stone-100 relative overflow-hidden mb-4">
                        {item.image_url ? (
                            <Image
                                src={item.image_url}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                                No Image
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-serif italic text-lg text-stone-800">{item.title}</h4>
                        {item.price && (
                            <p className="text-sm font-medium text-[#004d4d]">€{item.price.toFixed(2)}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}