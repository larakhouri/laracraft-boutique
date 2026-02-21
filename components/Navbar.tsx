'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { UserNav } from './user-nav'
import { SIX_PILLARS } from '@/config/navigation'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'

export default function Navbar({ locale: currentLocale, user, profile }: { locale: string, user: any, profile: any }) {
    const t = useTranslations('Navigation')
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
            {/* 🟢 FITTED NAVBAR: Reduced height on mobile (h-24), Backdrop Blur, and Dark Mode Protection */}
            <nav
                dir="ltr"
                className="h-24 md:h-[25vh] md:min-h-[180px] w-full bg-[#fdfcf8] border-b border-stone-100 sticky top-0 z-[100] px-4 md:px-12 lg:px-24 py-4 md:py-8 font-sans transition-all duration-300"
                style={{
                    forcedColorAdjust: 'none', // 🛡️ Anti-Brown Protection
                    colorScheme: 'light'       // 🛡️ Anti-Inversion Protection
                }}
            >
                <div className="max-w-[1800px] mx-auto h-full flex flex-col justify-between items-center">

                    {/* 🟢 TOP ROW: Balanced for Mobile */}
                    <div className="w-full flex justify-between items-center relative h-full md:h-auto">

                        {/* Mobile Menu Toggle (Left) */}
                        <div className="md:hidden flex-1 flex justify-start">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 text-[#004d4d] hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Logo - Perfectly Centered on Mobile, Scaled Down */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none md:flex-1 md:flex md:justify-center">
                            <Link href="/" className="block transition-transform duration-500 hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="LaraCraft"
                                    width={360}
                                    height={120}
                                    priority
                                    className="h-12 md:h-28 w-auto object-contain"
                                    style={{ filter: 'none' }} // Prevents browser from auto-inverting logo colors
                                />
                            </Link>
                        </div>

                        {/* Actions (Right) */}
                        <div className="flex flex-1 justify-end items-center gap-2 md:gap-8">
                            <div className="hidden md:block">
                                <LanguageSwitcher />
                            </div>
                            <UserNav user={user} profile={profile} />
                        </div>
                    </div>

                    {/* 🟢 BOTTOM ROW: Desktop Navigation Only */}
                    <div className="hidden md:flex justify-center items-center gap-8 lg:gap-12 w-full pt-4">
                        {SIX_PILLARS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    className={`text-[10px] lg:text-[12px] uppercase tracking-[0.3em] font-medium leading-none h-5 flex items-center transition-all duration-300 border-b-2 pb-1 whitespace-nowrap
                                    ${isActive
                                            ? 'border-[#004d4d] text-[#004d4d]'
                                            : 'border-transparent text-stone-500 hover:text-[#004d4d]'
                                        }`}
                                >
                                    {getLocalizedName(link)}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </nav>

            {/* 🟢 MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 z-[200] bg-[#fdfcf8] flex flex-col p-8"
                        style={{ forcedColorAdjust: 'none', colorScheme: 'light' }}
                    >
                        <div className="flex justify-between items-center mb-16">
                            <span className="font-serif italic text-xl text-[#004d4d]">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-[#004d4d] hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex flex-col space-y-6">
                            {SIX_PILLARS.map((link, idx) => (
                                <motion.div
                                    key={link.key}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="font-serif text-4xl italic text-[#004d4d] hover:text-[#2A8B8B] transition-colors"
                                    >
                                        {getLocalizedName(link)}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile Actions: Profile & Language */}
                        <div className="mt-auto pt-8 border-t border-stone-100 flex justify-between items-center">
                            <div className="flex gap-4">
                                {['en', 'de', 'ar'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => {
                                            switchLocale(lang)
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className={`text-xs uppercase tracking-widest ${locale === lang ? 'font-bold text-[#004d4d]' : 'text-stone-400'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}