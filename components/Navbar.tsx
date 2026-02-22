'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { UserNav } from './user-nav'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'

const SIX_PILLARS = [
    { key: 'atelier', href: '/the-atelier', name: { en: 'The Atelier', de: 'Das Atelier', ar: 'المرسم' } },
    { key: 'bespoke', href: '/bespoke', name: { en: 'Bespoke', de: 'Maßgeschneidert', ar: 'حسب الطلب' } },
    { key: 'printed-designs', href: '/printed-designs', name: { en: 'Printed Designs', de: 'Gedruckte Designs', ar: 'تصاميم مطبوعة' } },
    { key: 'gallery', href: '/gallery', name: { en: 'The Lens Gallery', de: 'Die Objektiv-Galerie', ar: 'معرض العدسة' } },
    { key: 'supplies', href: '/makers-supplies', name: { en: "Maker's Supplies", de: 'Bastelbedarf', ar: 'مستلزمات الصانع' } },
    { key: 'final-gift', href: '/FinalGift', name: { en: 'The Final Gift', de: 'Das Letzte Geschenk', ar: 'الهدية النهائية' } }
];

export default function Navbar({ locale: currentLocale, user, profile }: { locale: string, user: any, profile: any }) {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const getLocalizedName = (pillar: any) => pillar.name[locale as keyof typeof pillar.name] || pillar.name.en
    const switchLocale = (newLocale: string) => router.replace(pathname, { locale: newLocale });

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const activeElement = container.querySelector('[data-active="true"]') as HTMLElement;
        if (activeElement) {
            const scrollPosition = activeElement.offsetLeft - (container.offsetWidth / 2) + (activeElement.offsetWidth / 2);
            container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
    }, [pathname]);

    return (
        <>
            {/* 🟢 BRAND IMMERSION: bg-[#f8f8f2] to match your logo exactly */}
            <header className="w-full bg-[#f8f8f2] fixed top-0 left-0 right-0 z-[1000] transition-all" style={{ forcedColorAdjust: 'none', colorScheme: 'light' }}>
                <div className="max-w-[1800px] mx-auto w-full px-4 md:px-12 flex items-center justify-between h-24 md:h-32">

                    {/* MOBILE HAMBURGER */}
                    <div className="flex md:hidden flex-1">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-[#004d4d]" aria-label="Open Menu">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* 🟢 LOGO: Significantly larger corner presence */}
                    <div className="flex justify-center items-center">
                        <Link href="/" className="block">
                            <Image
                                src="/logo.png"
                                alt="LaraCraft"
                                width={280}
                                height={100}
                                priority
                                className="h-20 md:h-28 w-auto object-contain transition-transform hover:scale-105"
                            />
                        </Link>
                    </div>

                    {/* RIGHT CONTROLS */}
                    <div className="flex-1 flex justify-end items-center gap-4">
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>
                        <UserNav user={user} profile={profile} />
                    </div>
                </div>

                {/* MOBILE CATEGORY RIBBON */}
                <div ref={scrollContainerRef} className="md:hidden w-full overflow-x-auto relative border-t border-stone-200/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex items-center px-4 py-2 gap-3 w-max">
                        {SIX_PILLARS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.key} href={link.href} data-active={isActive}
                                    className={`group relative flex flex-col items-center justify-center text-[9px] uppercase tracking-[0.1em] font-medium text-center whitespace-normal min-w-[80px] max-w-[95px] h-10 leading-[1.2] transition-colors duration-300 pb-1 ${isActive ? 'text-[#004d4d]' : 'text-stone-400 hover:text-[#004d4d]'
                                        }`}
                                >
                                    {getLocalizedName(link)}
                                    <span className={`absolute bottom-1 h-[1.5px] bg-[#BFA05A] transition-all duration-300 ${isActive ? 'w-6' : 'w-0 group-hover:w-6'}`}></span>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* DESKTOP PILLARS ROW */}
                <div className="hidden md:flex w-full justify-center gap-10 py-5 border-t border-stone-200/50">
                    {SIX_PILLARS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.key} href={link.href}
                                className={`group relative flex flex-col items-center text-[11px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 pb-2 ${isActive ? 'text-[#004d4d]' : 'text-stone-400 hover:text-[#004d4d]'
                                    }`}
                            >
                                {getLocalizedName(link)}
                                <span className={`absolute bottom-0 h-[1.5px] bg-[#BFA05A] transition-all duration-300 ${isActive ? 'w-8' : 'w-0 group-hover:w-8'}`}></span>
                            </Link>
                        )
                    })}
                </div>
            </header>

            {/* 🟢 SPACER: Increased to prevent content from hiding under the large logo header */}
            <div className="h-[140px] md:h-[190px] w-full"></div>

            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="fixed inset-0 z-[1001] bg-[#f8f8f2] flex flex-col p-8"
                        style={{ forcedColorAdjust: 'none', colorScheme: 'light' }}
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-serif italic text-xl text-[#004d4d]">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="w-8 h-8 text-[#004d4d]" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6">
                            {SIX_PILLARS.map((link) => (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`font-serif italic text-4xl border-b border-stone-100 pb-2 transition-colors ${pathname === link.href ? 'text-[#BFA05A]' : 'text-[#004d4d]'}`}
                                >
                                    {getLocalizedName(link)}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto flex gap-6 pt-6 border-t border-stone-100">
                            {['en', 'de', 'ar'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => { switchLocale(lang); setIsMobileMenuOpen(false); }}
                                    className={`uppercase tracking-tighter text-sm ${locale === lang ? 'text-[#004d4d] font-bold underline' : 'text-stone-400'}`}
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