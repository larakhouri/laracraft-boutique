import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export default async function ArtisanGrid() {
    const supabase = await createClient();

    // Fetching from the new 'printing_guide' table
    const { data: formats } = await supabase
        .from('printing_guide')
        .select('*')
        .order('title', { ascending: true });

    return (
        <section className="max-w-[1750px] mx-auto px-12 md:px-24 mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
                {formats?.map((item) => (
                    <div key={item.id} className="group flex flex-col items-center">
                        <div className="relative w-full aspect-square bg-[#f8f8f6] overflow-hidden border border-stone-100 shadow-sm group-hover:shadow-2xl transition-all duration-1000">
                            {item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    alt={item.title}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-stone-300 italic">No Preview</div>
                            )}
                            <div className="absolute inset-0 bg-[#003D4D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>

                        <div className="mt-10 text-center">
                            <h3 className="font-serif text-lg text-stone-800 leading-tight px-6 h-12 flex items-center justify-center">
                                {item.title}
                            </h3>
                            <div className="w-8 h-[1px] bg-[#C5A059] mx-auto mt-4 opacity-40" />
                        </div>
                    </div>
                ))}
                {(!formats || formats.length === 0) && (
                    <div className="col-span-full py-20 text-center border border-dashed border-stone-200">
                        <p className="font-serif italic text-stone-400">Loading Artisan Examples...</p>
                    </div>
                )}
            </div>
        </section>
    );
}
