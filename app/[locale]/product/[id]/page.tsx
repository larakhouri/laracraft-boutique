import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductPage(props: {
    params: Promise<{ id: string, locale: string }>
}) {
    const { id } = await props.params;
    const supabase = await createClient();

    // 1. Define all possible vaults
    const vaults = [
        'atelier_products',
        'products',
        'supplies_products',
        'lifestyle_products',
        'printing_guide',
        'printed_designs'
    ]

    let product = null;
    // 2. Scan every vault
    for (const table of vaults) {
        // We check BOTH id and external_id to be safe
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .or(`id.eq.${id},external_id.eq.${id}`)
            .maybeSingle()

        if (data) {
            product = data
            break
        }
    }

    if (!product) {
        console.error(`❌ Product Resolver: ID ${id} not found in any Artisan Vault.`);
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#F8F6F1] p-8 md:p-24">
            <div className="max-w-6xl mx-auto animate-in fade-in duration-700">

                {/* --- MAIN PRODUCT VISUAL --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        {/* Main Hero Image */}
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100 border border-stone-200">
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>

                        {/* Supporting Detail Grid */}
                        {product.images && product.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img: string, idx: number) => (
                                    // Skip the main image if it's already in the gallery array
                                    img !== product.image_url && (
                                        <div
                                            key={idx}
                                            className="aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50 cursor-zoom-in group"
                                        >
                                            <img
                                                src={img}
                                                alt={`Detail ${idx}`}
                                                className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                                            />
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- PRODUCT INFO (Stories in 3 Languages) --- */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="font-serif text-4xl italic text-[#003D4D] mb-2">{product.title}</h1>
                            <p className="text-xl text-stone-600">€{product.price}</p>
                        </div>

                        <div className="space-y-6 border-t border-stone-100 pt-8">
                            {/* English Story */}
                            <div className="prose prose-stone italic font-serif text-lg leading-relaxed text-stone-700">
                                {product.description}
                            </div>

                            {/* German Story (If exists) */}
                            {product.description_de && (
                                <div className="prose prose-stone italic font-serif text-base text-stone-500 border-l-2 border-stone-100 pl-6">
                                    {product.description_de}
                                </div>
                            )}

                            {/* Arabic Story (If exists) */}
                            {product.description_ar && (
                                <div
                                    dir="rtl"
                                    className="font-serif text-xl leading-loose text-right text-[#003D4D] bg-stone-50/50 p-6 rounded-xl"
                                >
                                    {product.description_ar}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}