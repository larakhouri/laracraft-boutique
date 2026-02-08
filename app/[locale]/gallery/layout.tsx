import Link from 'next/link';
import { Printer } from 'lucide-react';

export default async function GalleryLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <section className="flex flex-col min-h-screen">
            {/* 🟢 THE PRINT GUIDE BAND: Now redirecting to the Guide, not the Shop */}
            <div className="w-full bg-[#003D4D] py-14 px-12 md:px-24 flex flex-col md:flex-row items-center justify-between border-b border-[#002b36]">
                <div className="flex items-center gap-10 mb-8 md:mb-0">
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

                {/* 🟢 FIXED REDIRECT: Pointing to the internal Gallery Guide */}
                <Link
                    href={`/${locale}/gallery/print-guide`}
                    className="bg-white/10 hover:bg-white text-white hover:text-[#003D4D] px-12 py-5 text-[11px] uppercase tracking-[0.4em] font-bold border border-white/20 transition-all duration-700 ease-in-out shadow-xl"
                >
                    Explore Guide →
                </Link>
            </div>

            {/* 🟢 THE GALLERY GRID */}
            <div className="flex-1 bg-[#FBFBF9]">
                {children}
            </div>
        </section>
    );
}
