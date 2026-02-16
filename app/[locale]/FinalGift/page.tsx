'use client'
import React from 'react'
import { createClient } from '@/utils/supabase/client'
import { ShoppingBag } from 'lucide-react'
import { Link } from '@/app/navigation'

export default function FinalGiftPage() {
    const supabase = createClient();
    const [products, setProducts] = React.useState<any[]>([]);

    React.useEffect(() => {
        async function fetchLifestyle() {
            const { data } = await supabase.from('lifestyle_products').select('*').order('updated_at', { ascending: false });
            if (data) setProducts(data);
        }
        fetchLifestyle();
    }, []);

    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">
            {/* Standardized Blue Band with Motion */}
            <div className="w-full bg-[#003D4D] py-16 px-12 md:px-24 border-b border-[#002b36] animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                <div className="max-w-[1800px] mx-auto flex flex-col items-center justify-center text-center space-y-4">
                    <ShoppingBag className="w-5 h-5 text-stone-200/30 stroke-[1.5]" />
                    <h1 className="font-serif text-5xl md:text-6xl text-white italic leading-tight tracking-tight uppercase">Finalize Your Gift</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold opacity-70">Artisan essentials for your collection</p>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-24 animate-in fade-in duration-1000 delay-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {products.map((item) => (
                        <Link key={item.id} href={`/product/${item.external_id}`} className="group block text-center">
                            <div className="relative aspect-square bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <h3 className="mt-6 font-serif text-lg text-[#003D4D]">{item.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}