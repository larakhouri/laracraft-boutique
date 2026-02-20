'use client'
import React from 'react'
import { Link } from '@/app/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

export default function PrintingGuide() {
    const t = useTranslations('PrintingGuide');

    return (
        <div className="fixed bottom-10 right-10 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Link
                href="/gallery/print-guide"
                className="group flex items-center gap-6 bg-[#003D4D]/95 backdrop-blur-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-full pl-8 pr-2 py-2 hover:bg-[#002b36] hover:border-[#C5A059]/50 transition-all duration-500 hover:shadow-[#C5A059]/10"
            >
                {/* Text Instructions: "If you want to print... Discover the Guide" */}
                <div className="flex flex-col justify-center border-r border-white/10 pr-6 py-1">
                    <span className="text-[10px] leading-tight uppercase tracking-[0.05em] font-medium text-stone-300 max-w-[180px]">
                        {t('heroPrefix')}
                    </span>
                    <span className="text-[11px] mt-1 uppercase tracking-widest text-[#C5A059] font-bold italic">
                        {t('heroSuffix')}
                    </span>
                </div>

                {/* Visual Action Icon */}
                <div className="bg-[#C5A059] rounded-full p-4 group-hover:bg-[#d4b477] transition-all duration-500 shadow-lg flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-[#003D4D] group-hover:translate-x-1 transition-transform duration-500" />
                </div>
            </Link>
        </div>
    )
}