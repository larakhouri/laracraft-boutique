'use client';
import Link from 'next/link';
import { Sprout, PenTool, Printer, Camera, Package } from 'lucide-react';

const categories = [
    { name: 'The Atelier', icon: Sprout, href: '/the-atelier' },
    { name: 'Bespoke', icon: PenTool, href: '/bespoke' },
    { name: 'Printed Designs', icon: Printer, href: '/printed-designs' },
    { name: 'Lens Gallery', icon: Camera, href: '/gallery' },
    { name: 'Makers Supplies', icon: Package, href: '/makers-supplies' }
];

export default function HomePage() {
    return (
        <main className="min-h-[70vh] w-full bg-[#FBFBF9] flex flex-col justify-center px-12 py-20">
            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-2 md:grid-cols-5 gap-20">
                {categories.map((cat) => (
                    <Link href={cat.href} key={cat.name} className="flex flex-col items-center group">
                        {/* ORIGINAL ICON: No shadow, thin stroke */}
                        <cat.icon strokeWidth={1} className="w-10 h-10 mb-6 text-stone-300 group-hover:text-[#003D4D] transition-colors" />

                        <h3 className="text-[10px] uppercase tracking-[0.4em] text-stone-400 group-hover:text-[#003D4D] font-bold text-center">
                            {cat.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </main>
    );
}