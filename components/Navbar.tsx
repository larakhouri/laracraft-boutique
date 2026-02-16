'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/app/navigation';
import { UserNav } from './user-nav'

export default function Navbar({ locale, user, profile }: { locale: string, user: any, profile: any }) {
    const t = useTranslations('Navigation')
    const pathname = usePathname()

    // 🟢 VAULT SYNC: Updated to match your 5 Supabase tables
    const navLinks = [
        { key: 'atelier', href: '/the-atelier', label: 'THE ATELIER' },
        { key: 'bespoke', href: '/bespoke', label: 'BESPOKE' }, // 👈 Keep this as /bespoke
        { key: 'printed', href: '/printed-designs', label: 'PRINTED DESIGNS' },
        { key: 'gallery', href: '/gallery', label: 'THE LENS GALLERY' },
        { key: 'supplies', href: '/makers-supplies', label: 'MAKER SUPPLIES' },
        { key: 'gift', href: '/FinalGift', label: 'FINALIZE YOUR GIFT' }
    ];

    return (
        <nav className="h-[25vh] min-h-[180px] w-full bg-[#fdfcf8] border-b border-stone-100 sticky top-0 z-[100] px-12 md:px-24 py-8">
            <div className="max-w-[1800px] mx-auto h-full flex flex-col justify-between items-center">

                {/* 🟢 TOP ROW: Brand & Language Toggle */}
                <div className="w-full flex justify-between items-center">
                    <div className="font-serif text-4xl font-bold text-[#004d4d] tracking-tighter">
                        <Link href="/">LaraCraft</Link>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* 🌍 Trilingual Toggle */}
                        <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase font-medium">
                            {['en', 'de', 'ar'].map((lang) => (
                                <React.Fragment key={lang}>
                                    <Link
                                        href={pathname}
                                        locale={lang as any}
                                        className={locale === lang ? 'text-[#004d4d] border-b border-[#004d4d]' : 'text-stone-400 hover:text-[#004d4d] transition-colors'}
                                    >
                                        {lang.toUpperCase()}
                                    </Link>
                                    {lang !== 'ar' && <span className="text-stone-200">|</span>}
                                </React.Fragment>
                            ))}
                        </div>
                        <UserNav user={user} profile={profile} />
                    </div>
                </div>

                {/* 🟢 BOTTOM ROW: The 5 Vaults (Centered) */}
                <div className="flex justify-center items-center gap-12">
                    {navLinks.map((link) => {
                        // Check if active (handling the locale prefix automatically via next-intl)
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.key}
                                href={link.href}
                                className={`text-[12px] uppercase tracking-[0.3em] font-medium transition-all duration-300 border-b-2 pb-1
                                    ${isActive
                                        ? 'border-[#004d4d] text-[#004d4d]'
                                        : 'border-transparent text-stone-500 hover:text-[#004d4d]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}