'use client'
import React from 'react'
import { Link } from '@/i18n/routing' // Assuming you want them clickable

interface WishlistItem {
    id: string
    external_id?: string
    title: string
    image_url?: string
    price?: number
}

export default function WishlistGrid({ items }: { items: WishlistItem[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="py-20 text-center border border-dashed border-stone-200 bg-stone-50/50 rounded-sm">
                <h3 className="font-serif text-xl italic text-stone-400 mb-2">The Archive is Empty</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Curate your collection to see artifacts here.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in duration-1000">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={`/product/${item.external_id || item.id}`}
                    className="group cursor-pointer block"
                >
                    <div className="aspect-[4/5] bg-white border border-stone-100 relative overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all">
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-stone-300 font-bold">
                                Visual Pending
                            </div>
                        )}
                    </div>
                    <div className="space-y-1 text-center">
                        <h4 className="font-serif text-lg text-[#003D4D]">{item.title}</h4>
                        {item.price !== undefined && (
                            <p className="text-[11px] font-bold tracking-widest uppercase text-[#C5A059]">
                                €{Number(item.price).toFixed(2)}
                            </p>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    )
}