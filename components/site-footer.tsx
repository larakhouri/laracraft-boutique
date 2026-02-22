'use client'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Instagram, Mail } from 'lucide-react'
import { SIX_PILLARS } from '@/config/navigation'

export function SiteFooter() {
    const t = useTranslations('Footer')
    const params = useParams()
    const locale = params.locale as string

    return (
        /* 🟢 BRAND IMMERSION: bg-[#f8f8f2] to match your logo exactly */
        <footer className="w-full bg-[#f8f8f2] border-t border-[#004d4d]/10 py-16 px-8 md:px-24 text-[#004d4d]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Col 1: Brand & Bio */}
                <div className="space-y-6">
                    <Link href="/" className="block">
                        {/* 🟢 FOOTER LOGO: Increased presence and removed opacity for clarity */}
                        <Image
                            src="/logo.png"
                            alt="LaraCraft"
                            width={250}
                            height={80}
                            className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-500"
                        />
                    </Link>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] leading-relaxed opacity-80 max-w-xs">
                        {t('bio')}
                    </p>
                    <div className="flex gap-6 pt-2">
                        <a href="https://instagram.com/laracraft_giftstore" target="_blank" className="hover:text-[#BFA05A] transition-colors">
                            <Instagram className="w-5 h-5 stroke-[1.5]" />
                        </a>
                        <a href="mailto:storelaracraft@gmail.com" className="hover:text-[#BFA05A] transition-colors">
                            <Mail className="w-5 h-5 stroke-[1.5]" />
                        </a>
                        {/* TikTok Link */}
                        <a href="https://tiktok.com/@lara.craft.gift.s" target="_blank" className="text-[10px] font-bold uppercase tracking-widest hover:text-[#BFA05A] transition-colors pt-1">
                            TikTok
                        </a>
                    </div>
                </div>

                {/* Col 2: Explore (The 6 Pillars) */}
                <div className="space-y-6">
                    <h4 className="font-serif text-xl italic opacity-90">{t('explore')}</h4>
                    <ul className="grid grid-cols-2 md:grid-cols-1 gap-3 text-[11px] uppercase tracking-[0.15em] font-medium">
                        {SIX_PILLARS.map((link) => (
                            <li key={link.key}>
                                <Link href={link.href} className="hover:text-[#BFA05A] transition-colors">
                                    {link.name[locale as keyof typeof link.name] || link.name.en}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 3: Legal (German Requirement) */}
                <div className="space-y-6">
                    <h4 className="font-serif text-xl italic opacity-90">{t('legal')}</h4>
                    <ul className="space-y-3 text-[10px] uppercase tracking-widest font-medium opacity-80">
                        <li><Link href="/impressum" className="hover:text-[#BFA05A] transition-colors">{t('impressum')}</Link></li>
                        <li><Link href="/privacy" className="hover:text-[#BFA05A] transition-colors">{t('privacy')}</Link></li>
                        <li><Link href="/terms" className="hover:text-[#BFA05A] transition-colors">{t('terms')}</Link></li>
                        <li><Link href="/refund" className="hover:text-[#BFA05A] transition-colors">{t('refund')}</Link></li>
                        <li className="pt-8 text-[9px] opacity-40 italic font-serif">
                            © {new Date().getFullYear()} LaraCraft. Cologne, Germany.
                        </li>
                    </ul>
                </div>

            </div>
        </footer>
    )
}