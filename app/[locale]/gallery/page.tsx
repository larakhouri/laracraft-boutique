import { createClient } from '@/utils/supabase/server';
import GalleryGrid from '@/components/GalleryGrid';

export default async function GalleryPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: galleryItems } = await supabase
        .from('products')
        .select('id, title, description, image_url')
        .eq('category_slug', 'gallery')
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 md:px-12 bg-[#F8F6F1]">
            <div className="max-w-[1800px] mx-auto">
                <header className="mb-20 text-center">
                    <h1 className="font-serif text-5xl md:text-7xl text-[#003D4D] mb-6 italic">
                        The Lens Gallery
                    </h1>
                    <p className="text-[#003D4D]/60 uppercase tracking-[0.3em] text-xs font-medium">
                        Curated Perspectives & Visual Narratives
                    </p>
                </header>

                <GalleryGrid items={galleryItems || []} />
            </div>
        </main>
    );
}
