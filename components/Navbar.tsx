'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { UserNav } from './user-nav'

export default function Navbar({ locale, user, profile }: { locale: string, user: any, profile: any }) {
    const t = useTranslations('Navigation')
    const pathname = usePathname()
    const router = useRouter()

    // 🟢 ROUTING SYNC: These must match your folder names in app/[locale]/
    const navLinks = [
        { key: 'atelier', href: '/the-atelier' },
        { key: 'bespoke', href: '/bespoke' },
        { key: 'printed', href: '/printed-designs' },
        { key: 'gallery', href: '/gallery' },
        { key: 'supplies', href: '/makers-supplies' }
    ];

    const switchLocale = (newLocale: string) => {
        const pathSegments = pathname.split('/')
        if (pathSegments.length > 1) {
            pathSegments[1] = newLocale
            router.push(pathSegments.join('/'))
        } else {
            router.push(`/${newLocale}`)
        }
    }

    return (
        <nav className="h-[25vh] min-h-[180px] w-full bg-[#fdfcf8] border-b border-stone-100 sticky top-0 z-[100] px-12 md:px-24 py-8">
            <div className="max-w-[1800px] mx-auto h-full flex flex-col justify-between items-center">

                {/* 🟢 TOP ROW: Brand (Left) & Utilities (Right) - PERFECTLY LEVEL */}
                <div className="w-full flex justify-between items-center">
                    <div className="font-serif text-4xl font-bold text-[#004d4d] tracking-tighter">
                        <Link href={`/${locale}`}>LaraCraft</Link>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-1">
                            {['en', 'de', 'ar'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => switchLocale(lang)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300
                                        ${locale === lang ? 'bg-[#004d4d] text-white' : 'text-stone-600 hover:text-[#004d4d]/10'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <UserNav user={user} profile={profile} />
                    </div>
                </div>

                {/* 🟢 BOTTOM ROW: 5 Categories (Centered) */}
                <div className="flex justify-center items-center gap-12">
                    {navLinks.map((link) => {
                        const fullPath = `/${locale}${link.href}`;
                        const isActive = pathname === fullPath;
                        return (
                            <Link
                                key={link.key}
                                href={fullPath}
                                className={`text-[12px] uppercase tracking-[0.3em] font-medium transition-all duration-300 border-b-2 pb-1
                                    ${isActive ? 'border-[#004d4d] text-[#004d4d]' : 'border-transparent text-stone-500 hover:text-[#004d4d]'}`}
                            >
                                {t(link.key)}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}