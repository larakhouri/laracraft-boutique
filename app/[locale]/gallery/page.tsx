import { createClient } from '@/utils/supabase/server';
import ArtisanHero from '@/components/ArtisanHero';
import { Camera, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function GalleryPage() {
    const supabase = await createClient();

    // 🟢 FETCHING: Ensure this points to your intended images table
    const { data: images } = await supabase.from('printed_designs').select('*').limit(20);

    return (
        <main className="min-h-screen bg-[#F8F6F1]">
            <ArtisanHero
                title="The Lens Gallery"
                subtitle="Curated Perspectives & Visual Narratives"
                Icon={Camera}
            >
                {/* 🟢 RESTORED: The Printing Guide Details inside the Banner */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                    <p className="text-[#fdfcf8] text-xs uppercase tracking-[0.2em] font-medium max-w-xs leading-relaxed">
                        To print any photo from the gallery, visit the guide.
                    </p>
                    <div className="h-px w-12 bg-[#C5A059]/30 hidden md:block" />
                    <Link
                        href="/printed-designs"
                        className="group flex items-center gap-3 text-[#C5A059] hover:text-white transition-colors"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Discover the printing guide</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </Link>
                </div>
            </ArtisanHero>

            {/* Gallery Grid remains the same below... */}
            <div className="max-w-[1800px] mx-auto px-6 py-24">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {images?.map((img, idx) => (
                        <div key={idx} className="break-inside-avoid">
                            <img src={img.image_url} className="w-full rounded-sm border border-stone-200 shadow-sm" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}