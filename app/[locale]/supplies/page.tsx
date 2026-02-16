'use client'
import React from 'react'
import { createClient } from '@/utils/supabase/client'
import { Brush } from 'lucide-react'
import { Link } from '@/app/navigation'

export default function MakersSuppliesPage() {
    const supabase = createClient();
    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase
                .from('supplies_products')
                .select('*')
                .order('updated_at', { ascending: false });

            if (data) setProducts(data);
            setLoading(false);
        }
        fetchProducts();
    }, []);

    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">

            {/* 🔵 BLUE BAND HEADER: Consistent Motion Engine */}
            <div className="w-full bg-[#003D4D] py-24 px-12 md:px-24 border-b border-[#002b36] animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                <div className="max-w-[1800px] mx-auto flex flex-col items-center justify-center text-center space-y-6">
                    <div className="p-4 bg-white/5 rounded-full border border-white/10">
                        <Brush className="w-8 h-8 text-stone-200 stroke-[1px]" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="font-serif text-5xl md:text-7xl text-white italic leading-tight tracking-tight uppercase">
                            Makers Supplies
                        </h1>
                        <p className="text-[11px] uppercase tracking-[0.5em] text-stone-400 font-bold italic">
                            Professional tools from my social content
                        </p>
                    </div>
                </div>
            </div>

            {/* 🏺 PRODUCT GRID: On Gallery Cream Background */}
            <div className="px-6 md:px-12 lg:px-24 py-24">
                {!loading && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 max-w-[1800px] mx-auto animate-in fade-in duration-1000 delay-500">
                        {products.map((item) => (
                            <Link key={item.id} href={`/product/${item.external_id}`} className="group block">
                                <div className="relative aspect-square bg-white rounded-lg shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl overflow-hidden border border-stone-200">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="mt-6 text-center space-y-1">
                                    <h3 className="font-serif text-lg text-[#003D4D] group-hover:text-stone-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="w-8 h-[1px] bg-[#003D4D]/20 mx-auto transition-all duration-500 group-hover:w-1/2" />
                                    <p className="text-[10px] tracking-widest text-stone-400 uppercase mt-2 font-medium">
                                        Professional Gear
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : !loading && (
                    <div className="text-center py-20 opacity-40 font-serif italic text-[#003D4D]">
                        No supplies found in the creator vault.
                    </div>
                )}
            </div>
        </main>
    )
}