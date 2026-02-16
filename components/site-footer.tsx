'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Instagram, Mail } from 'lucide-react'

export function SiteFooter() {
    const t = useTranslations('Footer')
    const params = useParams()
    const locale = params.locale as string

    return (
        <footer className="w-full bg-[#fdfcf8] border-t border-[#004d4d]/10 py-16 px-8 md:px-24 text-[#004d4d]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Col 1: Brand & Bio */}
                <div className="space-y-4">
                    <h3 className="font-serif text-2xl font-medium tracking-tight">LaraCraft</h3>
                    <p className="font-sans text-xs uppercase tracking-widest leading-relaxed opacity-80 max-w-xs">
                        {t('bio')}
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a href="https://instagram.com/laracraft_giftstore" target="_blank" className="hover:opacity-60 transition">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="mailto:storelaracraft@gmail.com" className="hover:opacity-60 transition">
                            <Mail className="w-5 h-5" />
                        </a>
                        {/* TikTok Link */}
                        <a href="https://tiktok.com/@lara.craft.gift.s" target="_blank" className="text-xs font-bold uppercase hover:opacity-60 transition pt-1">
                            TikTok
                        </a>
                    </div>
                </div>

                {/* Col 2: Explore (The 4 Doors) */}
                <div className="space-y-4">
                    <h4 className="font-serif text-lg italic opacity-70">{t('explore')}</h4>
                    <ul className="space-y-2 text-sm font-sans tracking-wide">
                        <li><Link href={`/${locale}/the-atelier`} className="hover:underline">The Atelier</Link></li>
                        <li><Link href={`/${locale}/gallery`} className="hover:underline">The Lens Gallery</Link></li>
                        <li><Link href={`/${locale}/print-studio`} className="hover:underline">Printing Services</Link></li>
                        <li><Link href={`/${locale}/inventory`} className="hover:underline">Maker Supplies</Link></li>
                    </ul>
                </div>

                {/* Col 3: Legal (German Requirement) */}
                <div className="space-y-4">
                    <h4 className="font-serif text-lg italic opacity-70">{t('legal')}</h4>
                    <ul className="space-y-2 text-sm font-sans tracking-wide opacity-80">
                        <li><Link href={`/${locale}/impressum`} className="hover:underline">{t('impressum')}</Link></li>
                        <li><Link href={`/${locale}/privacy`} className="hover:underline">{t('privacy')}</Link></li>
                        <li><Link href={`/${locale}/terms`} className="hover:underline">{t('terms')}</Link></li>
                        <li><Link href={`/${locale}/refund`} className="hover:underline">{t('refund')}</Link></li>
                        <li className="pt-4 text-xs opacity-50">
                            © {new Date().getFullYear()} LaraCraft. Cologne, Germany.
                        </li>
                    </ul>
                </div>

            </div>
        </footer>
    )
}
