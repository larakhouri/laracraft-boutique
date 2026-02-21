import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Link } from '@/app/navigation'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default async function PrintGuideDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const supabase = await createClient();

    // Fetch the specific print option from the guide
    const { data: item } = await supabase
        .from('printing_guide')
        .select('*')
        .eq('id', slug)
        .single();

    if (!item) return notFound();

    return (
        <main className="min-h-screen bg-[#F8F6F1] font-sans">
            {/* Header / Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <Link href="/gallery/print-guide" className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest font-bold">Back to Materials</span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 pb-20">

                {/* LEFT: Product Mockup */}
                <div className="space-y-6">
                    <div className="bg-white p-6 shadow-xl border border-stone-200">
                        <img src={item.image_url} alt={item.title} className="w-full h-auto" />
                    </div>
                </div>

                {/* RIGHT: Specs & Action */}
                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <h1 className="font-serif italic text-5xl text-stone-900 mb-4">{item.title}</h1>
                        <p className="text-[#2A8B8B] text-2xl font-light">Base Price: {item.price}€</p>
                    </div>

                    <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
                        <p>This artisan format is synchronized directly with our Gelato production lab to ensure 1:1 color accuracy and archival permanence.</p>

                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2A8B8B]" /> Museum-grade materials</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2A8B8B]" /> Sustainably sourced frames</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2A8B8B]" /> Global artisan shipping</li>
                        </ul>
                    </div>

                    <div className="pt-8 border-t border-stone-200">
                        <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">Ready to print a gallery piece?</p>
                        <Link href="/gallery">
                            <button className="w-full bg-[#003D4D] hover:bg-[#002b36] text-white py-6 uppercase text-[10px] tracking-[0.3em] font-bold transition-all">
                                Select a Photo for this Format
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}