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

    // Helper to get localized name
    const getLocalizedName = (pillar: any) => {
        return pillar.name[locale as keyof typeof pillar.name] || pillar.name.en
    }

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    }

    return (
        <>
            <nav dir="ltr" className="h-[25vh] min-h-[180px] w-full bg-[#fdfcf8] border-b border-stone-100 sticky top-0 z-[100] px-6 md:px-12 lg:px-24 py-8 font-sans">
                <div className="max-w-[1800px] mx-auto h-full flex flex-col justify-between items-center">

                    {/* 🟢 TOP ROW: Brand & Language Toggle & Mobile Toggle */}
                    <div className="w-full flex justify-between items-center relative">
                        {/* Mobile Menu Toggle (Left on Mobile) */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 text-[#004d4d] hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none md:left-auto">
                            <Link href="/" className="block transition-transform duration-500 hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="LaraCraft"
                                    width={360}
                                    height={120}
                                    priority
                                    className="h-20 md:h-28 w-auto object-contain"
                                />
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 md:gap-8">
                            {/* 🌍 Trilingual Toggle (Hidden on small mobile, visible on md+) */}
                            <div className="hidden md:block">
                                <LanguageSwitcher />
                            </div>
                            <UserNav user={user} profile={profile} />
                        </div>
                    </div>

                    {/* 🟢 BOTTOM ROW: The 6 Pillars (Desktop Only) */}
                    <div className="hidden md:flex justify-center items-center gap-8 lg:gap-12 w-full">
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

            {/* 🟢 PREMIUM MOBILE MENU OVERLAY (Glass Effect) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[200] bg-stone-50/80 flex flex-col items-center justify-center p-6"
                    >
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-8 right-8 p-2 text-[#004d4d] hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="flex flex-col items-center space-y-8 text-center">
                            <h2 className="font-serif text-3xl italic text-[#004d4d] mb-4">Menu</h2>
                            {SIX_PILLARS.map((link, idx) => (
                                <motion.div
                                    key={link.key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="font-serif text-2xl md:text-4xl text-[#004d4d] hover:opacity-70 transition-opacity block py-2"
                                    >
                                        {getLocalizedName(link)}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile Language Switcher */}
                            <div className="flex gap-6 mt-12 pt-8 border-t border-[#004d4d]/20 w-32 justify-center">
                                {['en', 'de', 'ar'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => {
                                            switchLocale(lang)
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className={`text-sm uppercase tracking-widest ${locale === lang ? 'font-bold text-[#004d4d]' : 'text-stone-500'}`}
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
