'use client'
import { Link, usePathname } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'

export default function FloatingPrintGuide() {
    const pathname = usePathname();

    // 🟢 SHOW LOGIC: Strictly restricted to the Gallery ecosystem
    // This targets '/gallery' and any sub-route like '/gallery/photo-id'
    const isGalleryContext = pathname === '/gallery' || pathname.startsWith('/gallery/');

    // Kill the component if we are on any other page (Home, Shop, Atelier, etc.)
    if (!isGalleryContext) return null;

    return (
        <Link
            href="/printing-guide"
            className="fixed bottom-10 right-10 z-[999] flex items-center gap-4 pl-6 pr-2 py-2 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-500 group border border-[#C5A059]/40 backdrop-blur-md"
            style={{
                backgroundColor: 'rgba(0, 61, 77, 0.95)', // Deep Teal
            }}
        >
            <span
                className="text-[10px] uppercase tracking-[0.3em] font-bold"
                style={{ color: '#fdfcf8' }} // Off-White
            >
                Print Guide
            </span>

            {/* Artisan Gold Icon Disk */}
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-inner group-hover:rotate-45"
                style={{ backgroundColor: '#C5A059' }}
            >
                <ArrowRight
                    className="w-4 h-4 transition-transform duration-300"
                    style={{ color: '#003D4D' }}
                />
            </div>
        </Link>
    )
}