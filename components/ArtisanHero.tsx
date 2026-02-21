import React from 'react'

export default function ArtisanHero({
    title,
    subtitle,
    Icon,
    children // 🟢 We add children to allow custom content like your guide details
}: {
    title: string,
    subtitle: string,
    Icon?: any,
    children?: React.ReactNode
}) {
    return (
        <div className="w-full bg-[#003D4D] py-24 px-12 border-b border-[#002b36] animate-in fade-in duration-1000">
            <div className="max-w-4xl mx-auto text-center space-y-6">
                {Icon && (
                    <div className="flex justify-center mb-2">
                        <div className="w-14 h-14 border border-[#C5A059]/40 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-[#fdfcf8] stroke-[1.5]" />
                        </div>
                    </div>
                )}
                <h1 className="font-serif text-5xl md:text-7xl text-white italic tracking-tighter uppercase leading-tight">
                    {title}
                </h1>
                <div className="h-[1px] w-24 bg-[#C5A059] mx-auto" />
                <p className="text-stone-400 text-[10px] uppercase tracking-[0.5em] font-bold">
                    {subtitle}
                </p>

                {/* 🟢 CUSTOM DETAILS SECTION (The Printing Guide info) */}
                {children && (
                    <div className="pt-8 mt-8 border-t border-white/5">
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}