import Link from 'next/link';
import { Printer } from 'lucide-react';

export default function PrintGuideBanner({ locale }: { locale: string }) {
    return (
        <div className="w-full bg-[#003D4D] py-14 px-12 md:px-24 flex flex-col md:flex-row items-center justify-between border-b border-[#002b36]">
            <div className="flex items-center gap-10">
                <div className="p-5 bg-white/5 rounded-full border border-white/10">
                    <Printer className="w-12 h-12 text-stone-200 stroke-[1px]" />
                </div>
                <div className="space-y-3">
                    <h2 className="font-serif italic text-4xl text-white leading-tight">
                        Do you want to print these?
                    </h2>
                    <p className="text-[11px] uppercase tracking-[0.5em] text-stone-400 font-bold">
                        20 Artisan Format Mockups • Professional Guide
                    </p>
                </div>
            </div>

            <Link
                href={`/${locale}/gallery/print-guide`}
                className="bg-white/10 hover:bg-white text-white hover:text-[#003D4D] px-12 py-5 text-[11px] uppercase tracking-[0.4em] font-bold border border-white/20 transition-all duration-700 hover:scale-105"
            >
                Explore Guide →
            </Link>
        </div>
    );
}
