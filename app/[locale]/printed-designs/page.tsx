import { createClient } from '@/utils/supabase/server';
import ProductCard from '@/components/ProductCard';

export default async function PrintedDesignsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    // Fetch real data from Supabase
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', 'printed-designs');

    return (
        <main className="min-h-screen bg-[#FBFBF9] p-12 md:p-24">
            <header className="mb-20 text-center">
                <h1 className="font-serif text-5xl text-[#003D4D] italic">Printed Designs</h1>
                <p className="mt-4 text-[10px] uppercase tracking-[0.5em] text-stone-400">Artisan Paper Goods & Prints</p>
            </header>

            {/* 🟢 THE COMFORT GRID: 6 columns makes cards smaller & elegant */}
            <div className="max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {products && products.length > 0 ? (
                    products.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)
                ) : (
                    <div className="col-span-full py-20 text-center border border-dashed border-stone-200">
                        <p className="font-serif italic text-stone-400">Awaiting new arrivals...</p>
                    </div>
                )}
            </div>
        </main>
    );
}
