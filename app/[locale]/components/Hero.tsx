"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background with Ken Burns Effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                <Image
                    src="/<img>.jpg" // You might need to provide this image later or use a placeholder
                    alt="Artisan workspace"
                    fill
                    priority
                    className="object-cover animate-ken-burns"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center gap-8">
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-wide leading-tight">
                    {t('title')}
                </h1>
                <p className="font-sans text-lg md:text-xl font-light tracking-widest uppercase text-white/90 max-w-2xl">
                    {t('subtitle')}
                </p>

                <Link
                    href="/shop"
                    className="group relative px-8 py-4 bg-transparent border border-white/30 overflow-hidden transition-all duration-300 hover:border-white/60 glow-turquoise"
                >
                    <span className="relative z-10 font-sans text-sm tracking-[0.3em] uppercase transition-colors duration-300">
                        {t('cta')}
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
    );
}
