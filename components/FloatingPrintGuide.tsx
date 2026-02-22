'use client'
import { Link, usePathname } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'

export default function FloatingPrintGuide() {
    const pathname = usePathname();

    // 🟢 HIDE LIST: These pages do NOT need the print guide button
    const hideOnPages = [
        '/printed-designs',
        '/the-atelier',
        '/bespoke',
        '/makers-supplies',
        '/FinalGift'
    ];

    if (hideOnPages.includes(pathname)) return null;

    return (
        <Link
            href="/printed-designs"
            className="fixed bottom-10 right-10 z-[999] flex items-center gap-4 pl-6 pr-2 py-2 rounded-full shadow-2xl hover:scale-105 transition-all duration-500 group border border-[#C5A059]/40 backdrop-blur-md"
            style={{
                backgroundColor: 'rgba(0, 61, 77, 0.95)', // Enforced Deep Teal
            }}
        >
            <span
                className="text-[10px] uppercase tracking-[0.3em] font-bold"
                style={{ color: '#fdfcf8' }} // Enforced Off-White
            >
                Print Guide
            </span>

            {/* 🟢 THE ICON DISK: Replacing the big yellow/green circle */}
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-inner"
                style={{ backgroundColor: '#C5A059' }} // Enforced Artisan Gold
            >
                <ArrowRight
                    className="w-4 h-4"
                    style={{ color: '#003D4D' }} // Icon color matches the background
                />
            </div>
        </Link>
    )
}