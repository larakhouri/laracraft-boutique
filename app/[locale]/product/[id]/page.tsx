import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'
import ProductConfigurator from '@/components/ProductConfigurator'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductPage(props: {
    params: Promise<{ id: string, locale: string }>
}) {
    const { id } = await props.params;
    const supabase = await createClient();

    // 🟢 THE SEARCH PARTY: Must include gallery_products to find your photos!
    const vaults = [
        'gallery_products', // 🎯 Critical addition
        'printed_designs',
        'printing_guide',
        'atelier_products',
        'products',
        'supplies_products',
        'lifestyle_products'
    ]

    let product = null;

    // We loop through every vault until we find a match
    for (const table of vaults) {
        const { data } = await supabase
            .from(table)
            .select('*')
            .or(`id.eq.${id},external_id.eq.${id}`)
            .maybeSingle()

        if (data) {
            product = data;
            break;
        }
    }

    // If the loop finishes and product is still null, 404.
    if (!product) notFound();

    const getVariants = (data: any) => {
        if (!data) return [];
        let parsed = typeof data === 'string' ? JSON.parse(data) : data;
        if (Array.isArray(parsed)) return parsed;
        return parsed.variants || parsed.product?.variants || parsed.items || [];
    };

    const parsedVariants = getVariants(product.variants || product.images || product.price_data);

    return (
        <main className="min-h-screen bg-[#F8F6F1] pt-32 pb-24 px-8 md:px-24">
            <div className="max-w-6xl mx-auto">

                <Link
                    href="/gallery"
                    className="group flex items-center gap-2 text-stone-400 hover:text-[#003D4D] transition-colors mb-12 w-fit"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back to Gallery</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-6 sticky top-32">
                        <div className="relative aspect-square overflow-hidden bg-white border border-stone-100 shadow-sm">
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-full h-full object-contain p-12 transition-transform duration-1000 hover:scale-105"
                            />
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div>
                            <h1 className="font-serif text-5xl italic text-[#003D4D] mb-6 leading-tight">
                                {product.title}
                            </h1>
                            <div className="h-px w-16 bg-[#C5A059]" />
                        </div>

                        <div className="prose prose-stone italic font-serif text-lg leading-relaxed text-stone-600">
                            {product.description}
                        </div>

                        <ProductConfigurator
                            variants={parsedVariants}
                            basePrice={product.price || 0}
                            productId={product.id}
                            title={product.title}
                        />

                        <div className="pt-10 border-t border-stone-100">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 leading-loose">
                                Antigravity Technical Note<br />
                                Each print is produced on-demand to reduce environmental impact.
                                We utilize sustainably sourced materials for all framed options.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}