import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Printer, Info } from 'lucide-react'

export default async function PhotoPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const supabase = await createClient();

    // 1. Fetch the specific photo from the Lens Gallery
    const { data: photo } = await supabase
        .from('gallery_products')
        .select('*')
        .eq('id', slug)
        .single();

    // 2. Fetch the options from the Printing Guide to populate the dropdown
    const { data: printOptions } = await supabase
        .from('printing_guide')
        .select('id, title, price')
        .order('price', { ascending: true });

    if (!photo) return notFound();

    return (
        <div className="min-h-screen bg-[#F8F6F1] font-sans text-stone-900">
            {/* Navigation */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <Link
                    href={`/${locale}/gallery`}
                    className="group flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors w-fit"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-xs uppercase tracking-[0.2em]">Return to Gallery</span>
                </Link>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* LEFT COLUMN: THE VISUAL (7/12 width) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-4 md:p-8 shadow-2xl rounded-sm border border-stone-200/50">
                            <img
                                src={photo.image_url}
                                alt={photo.title}
                                className="w-full h-auto object-contain bg-stone-50"
                            />
                        </div>
                        <div className="flex justify-between items-center px-2">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 italic">
                                Artisan Vault Asset Ref: {photo.id.slice(0, 8)}
                            </p>
                            <span className="h-[1px] w-24 bg-stone-200"></span>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: THE ATELIER OPTIONS (5/12 width) */}
                    <div className="lg:col-span-5 flex flex-col justify-center py-4">
                        <div className="mb-10">
                            <h1 className="font-serif italic text-4xl md:text-5xl text-stone-800 mb-6 leading-tight">
                                {photo.title || 'Untitled Composition'}
                            </h1>
                            <div className="w-12 h-1 bg-[#2A8B8B] mb-6"></div>
                            <p className="text-stone-500 text-sm leading-relaxed max-w-md italic">
                                This exclusive piece is available for digital licensing or can be commissioned as a physical masterpiece via our artisan printing lab.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* OPTION 1: DIGITAL ASSET */}
                            <div className="group border-b border-stone-200 pb-8 hover:border-stone-400 transition-colors">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">Entry Level</h3>
                                        <h2 className="text-xl font-serif">Digital Asset License</h2>
                                    </div>
                                    <span className="text-2xl font-light text-stone-800">$25</span>
                                </div>
                                <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-none py-6 uppercase text-[10px] tracking-[0.2em]">
                                    <Download className="w-4 h-4 mr-2" /> Add Digital Download
                                </Button>
                            </div>

                            {/* OPTION 2: PHYSICAL PRINT (Dynamic from Guide) */}
                            <div className="pt-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A8B8B]">Physical Commissions</h3>
                                    <Link href={`/${locale}/admin/inventory?vault=printing_guide`} className="text-[9px] text-stone-400 hover:underline flex items-center gap-1">
                                        <Info className="w-3 h-3" /> View Material Specs
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    <select
                                        className="w-full bg-white border border-stone-200 p-4 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#2A8B8B] appearance-none cursor-pointer"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%232A8B8B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                                    >
                                        <option value="">Choose Format & Size...</option>
                                        {printOptions?.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.title} — ${option.price}
                                            </option>
                                        ))}
                                    </select>

                                    <Button className="w-full bg-[#2A8B8B] hover:bg-[#216d6d] text-white rounded-none py-6 uppercase text-[10px] tracking-[0.2em]">
                                        <Printer className="w-4 h-4 mr-2" /> Request Custom Print
                                    </Button>
                                    <p className="text-[9px] text-stone-400 text-center italic">
                                        Prints are individually reviewed and manually prepared for the lab.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}