import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditProductForm from '@/components/studio/EditProductForm'

export default async function Page(props: {
    params: Promise<{ id: string, locale: string }>,
    searchParams: Promise<{ vault?: string }>
}) {
    const { id, locale } = await props.params;
    const { vault } = await props.searchParams;
    const supabase = await createClient();

    const tableMap: Record<string, string> = {
        'atelier': 'atelier_products',
        'supplies': 'supplies_products',
        'gallery': 'products',
        'gift': 'lifestyle_products'
    };

    const targetTable = tableMap[vault || ''] || 'products';

    // Try target table, fallback to main products if missing
    let { data: product } = await supabase.from(targetTable).select('*').eq('id', id).maybeSingle();

    if (!product && targetTable !== 'products') {
        const { data: fallback } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
        product = fallback;
    }

    if (!product) notFound();

    return (
        <div className="min-h-screen bg-[#F8F6F1] p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="font-serif text-3xl italic text-[#003D4D]">Edit {vault || 'Item'}</h1>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">
                        Editing record in {targetTable}
                    </p>
                </header>
                <div className="bg-white p-8 border border-stone-200 shadow-sm">
                    <EditProductForm
                        product={product}
                        vault={vault || 'gallery'}
                        targetTable={targetTable}
                        locale={locale}
                    />
                </div>
            </div>
        </div>
    );
}