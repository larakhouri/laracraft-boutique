import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductPage(props: {
    params: Promise<{ id: string, locale: string }>
}) {
    const { id } = await props.params;
    const supabase = await createClient();

    const vaults = [
        'atelier_products',
        'products',
        'supplies_products',
        'lifestyle_products',
        'printed_designs'
    ]

    let product = null;
    for (const table of vaults) {
        const { data } = await supabase
            .from(table)
            .select('*')
            .or(`id.eq.${id},external_id.eq.${id}`)
            .maybeSingle()

        if (data) {
            product = data
            break
        }
    }

    if (!product) notFound();

    return (
        <main className="min-h-screen bg-[#F8F6F1] p-8 md:p-24">
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Visual Section */}
                    <div className="space-y-6">
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-white border border-stone-200 shadow-sm">
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-full h-full object-contain p-8 transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="font-serif text-5xl italic text-[#003D4D] mb-4">{product.title}</h1>
                            <div className="h-px w-12 bg-[#C5A059] mb-6" />
                            <p className="text-2xl text-stone-600 font-light">€{Number(product.price).toFixed(2)}</p>
                        </div>

                        <div className="prose prose-stone italic font-serif text-lg leading-relaxed text-stone-700 pt-8 border-t border-stone-100">
                            {product.description}
                        </div>

                        {product.description_ar && (
                            <div dir="rtl" className="font-serif text-2xl leading-loose text-right text-[#003D4D] bg-stone-50 p-8 rounded-xl border border-stone-100">
                                {product.description_ar}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}