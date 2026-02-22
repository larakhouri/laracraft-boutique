import { createClient } from '@/utils/supabase/server';
import ArtisanHero from '@/components/ArtisanHero';
import { Camera } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function GalleryPage() {
    const supabase = await createClient();

    // 🟢 VAULT FIX: Fetching from gallery_products instead of printed_designs
    const { data: images } = await supabase
        .from('gallery_products')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-[#F8F6F1]">
            <ArtisanHero
                title="The Lens Gallery"
                subtitle="Curated Perspectives & Visual Narratives"
                Icon={Camera}
            >
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                    <p className="text-[#fdfcf8] text-xs uppercase tracking-[0.2em] font-medium max-w-xs leading-relaxed">
                        To print any photo from the gallery, visit the guide.
                    </p>
                    <div className="h-px w-12 bg-[#C5A059]/30 hidden md:block" />
                    <Link
                        href="/printing-guide"
                        className="group flex items-center gap-3 text-[#C5A059] hover:text-white transition-colors"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Discover the printing guide</span>
                        <div className="w-6 h-6 rounded-full border border-[#C5A059]/30 flex items-center justify-center group-hover:bg-[#C5A059] transition-all">
                            <Camera className="w-3 h-3 group-hover:text-[#003D4D]" />
                        </div>
                    </Link>
                </div>
            </ArtisanHero>

            <div className="max-w-[1800px] mx-auto px-6 py-24">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {images && images.length > 0 ? (
                        images.map((img, idx) => (
                            <div key={idx} className="break-inside-avoid animate-in fade-in duration-700">
                                <img
                                    src={img.image_url}
                                    alt={img.title || "Gallery Item"}
                                    className="w-full rounded-sm border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-500"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 opacity-40 font-serif italic text-[#003D4D]">
                            The Gallery Vault is currently syncing...
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}