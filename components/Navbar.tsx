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
            {/* 🟢 FIXED PIXEL HEIGHT: Ensuring visibility on all mobile browsers */}
            <nav
                dir="ltr"
                className="w-full bg-[#fdfcf8] border-b border-stone-100 sticky top-0 z-[100] px-4 md:px-12 transition-all duration-300"
                style={{
                    height: '80px', // Hard-coded pixel height for mobile
                    forcedColorAdjust: 'none',
                    colorScheme: 'light'
                }}
            >
                <div className="max-w-[1800px] mx-auto h-full flex items-center justify-between relative">

                    {/* Left: Hamburger */}
                    <div className="md:hidden flex-1">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-[#004d4d]"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Center: Logo (Fitted) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:transform-none flex justify-center">
                        <Link href="/" className="block">
                            <Image
                                src="/logo.png"
                                alt="LaraCraft"
                                width={180}
                                height={60}
                                priority
                                className="h-10 md:h-16 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex-1 flex justify-end items-center gap-4">
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>
                        <UserNav user={user} profile={profile} />
                    </div>
                </div>

                {/* Desktop Menu Row (Only visible on MD+) */}
                <div className="hidden md:flex justify-center items-center gap-8 w-full h-12 border-t border-stone-50">
                    {SIX_PILLARS.map((link) => (
                        <Link
                            key={link.key}
                            href={link.href}
                            className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${pathname === link.href ? 'text-[#004d4d]' : 'text-stone-400'
                                }`}
                        >
                            {getLocalizedName(link)}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-[#fdfcf8] flex flex-col p-8"
                    >
                        <div className="flex justify-end">
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="w-8 h-8 text-[#004d4d]" />
                            </button>
                        </div>
                        <div className="flex flex-col space-y-8 mt-12">
                            {SIX_PILLARS.map((link) => (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="font-serif text-3xl italic text-[#004d4d]"
                                >
                                    {getLocalizedName(link)}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}