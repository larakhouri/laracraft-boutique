'use client'
import { Link, usePathname } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'

export default function FloatingPrintGuide() {
    const pathname = usePathname();

    // 🟢 UPDATED HIDE LIST: Disappearing on all pages except Gallery and Shop/Product views
    const hideOnPages = [
        '/printed-designs',
        '/the-atelier',
        '/bespoke',
        '/makers-supplies',
        '/FinalGift'
    ];

    // Check if current path is in the hide list
    if (hideOnPages.includes(pathname)) return null;

    return (
        <Link
            href="/printed-designs"
            className="fixed bottom-10 right-10 z-[999] flex items-center gap-3 bg-[#004d4d] pl-5 pr-3 py-3 rounded-full shadow-2xl hover:scale-110 transition-all group border border-[#C5A059]/30"
        >
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#fdfcf8] font-bold">Print Guide</span>
            <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center group-hover:bg-[#a88b4a] transition-colors">
                <ArrowRight className="w-4 h-4 text-[#004d4d]" />
            </div>
        </Link>
    )
}