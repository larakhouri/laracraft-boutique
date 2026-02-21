'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { UserNav } from './user-nav'
import { SIX_PILLARS } from '@/config/navigation'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar({ locale: currentLocale, user, profile }: { locale: string, user: any, profile: any }) {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const getLocalizedName = (pillar: any) => {
        return pillar.name[locale as keyof typeof pillar.name] || pillar.name.en
    }

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    }

    return (
        <>
            {/* 🟢 THE NAV CONTAINER: Solid height, high z-index, forced light mode */}
            <nav
                className="w-full bg-[#fdfcf8] border-b border-stone-200 sticky top-0 z-[1000] flex items-center justify-between px-4 h-20 md:h-32 transition-all"
                style={{ forcedColorAdjust: 'none', colorScheme: 'light' }}
            >
                {/* 1. HAMBURGER (Mobile Only) */}
                <div className="flex md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
                        <Menu className="w-6 h-6 text-[#004d4d]" />
                    </button>
                </div>

                {/* 2. LOGO (Responsive sizing) */}
                <div className="flex justify-center items-center">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="LaraCraft"
                            width={150}
                            height={50}
                            priority
                            className="h-10 md:h-16 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* 3. USER ACTIONS */}
                <div className="flex items-center gap-2">
                    <UserNav user={user} profile={profile} />
                </div>
            </nav>

            {/* 🟢 THE PILLARS (Desktop Only) */}
            <div className="hidden md:flex w-full bg-[#fdfcf8] justify-center gap-8 py-4 border-b border-stone-100">
                {SIX_PILLARS.map((link) => (
                    <Link
                        key={link.key}
                        href={link.href}
                        className={`text-[11px] uppercase tracking-widest ${pathname === link.href ? 'text-[#004d4d] font-bold' : 'text-stone-400'}`}
                    >
                        {getLocalizedName(link)}
                    </Link>
                ))}
            </div>

            {/* 🟢 MOBILE OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1001] bg-[#fdfcf8] flex flex-col p-10"
                        style={{ forcedColorAdjust: 'none', colorScheme: 'light' }}
                    >
                        <div className="w-full flex justify-end">
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="w-8 h-8 text-[#004d4d]" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-8 mt-10">
                            {SIX_PILLARS.map((link) => (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="font-serif italic text-3xl text-[#004d4d]"
                                >
                                    {getLocalizedName(link)}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto border-t border-stone-100 pt-6 flex gap-4">
                            {['en', 'de', 'ar'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => { switchLocale(lang); setIsMobileMenuOpen(false); }}
                                    className={`uppercase tracking-widest text-xs ${locale === lang ? 'text-[#004d4d] font-bold' : 'text-stone-400'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}