import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package, Edit, ArrowLeft, Plus } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import DeleteButton from '@/components/studio/DeleteButton'
import SyncInterface from './SyncInterface'

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export default async function InventoryListPage(props: {
    params: Promise<{ locale: string }>,
    searchParams: Promise<{ vault?: string }>
}) {
    const { locale } = await props.params;
    const { vault } = await props.searchParams;

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login');

    // --- 🎯 TARGETED FETCH LOGIC ---
    let combinedProducts: any[] = [];
    let pageTitle = "Universal Inventory";

    if (vault === 'printing_guide') {
        const { data } = await supabase.from('printing_guide').select('*').order('updated_at', { ascending: false });
        combinedProducts = (data || []).map(p => ({ ...p, vault: 'Printing Guide' }));
        pageTitle = "Printing Guide Vault";
    }
    else if (vault === 'printed_designs') {
        const { data } = await supabase.from('printed_designs').select('*').order('updated_at', { ascending: false });
        combinedProducts = (data || []).map(p => ({ ...p, vault: 'Printed Designs' }));
        pageTitle = "Printed Designs Vault";
    }
    else {
        // Universal View (Original Logic)
        const [resGallery, resAtelier, resSupplies, resPrinted] = await Promise.all([
            supabase.from('products').select('*').order('created_at', { ascending: false }),
            supabase.from('atelier_products').select('*').order('updated_at', { ascending: false }),
            supabase.from('supplies_products').select('*').order('updated_at', { ascending: false }),
            supabase.from('printed_designs').select('*').order('updated_at', { ascending: false })
        ]);

        combinedProducts = [
            ...(resGallery.data || []).map(p => ({ ...p, vault: 'The Lens Gallery' })),
            ...(resAtelier.data || []).map(p => ({ ...p, vault: 'Atelier' })),
            ...(resSupplies.data || []).map(p => ({ ...p, vault: 'Makers Supplies' })),
            ...(resPrinted.data || []).map(p => ({ ...p, vault: 'Printed Designs' }))
        ].sort((a, b) => new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime());
    }

    return (
        <div className="min-h-screen bg-[#F8F6F1] p-8 md:p-12 font-sans text-stone-900">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Button asChild variant="link" className="px-0 text-stone-500 hover:text-[#2A8B8B] mb-2">
                            <Link href={`/${locale}/admin/studio`}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Studio</Link>
                        </Button>
                        <h1 className="text-4xl font-serif italic text-stone-800">{pageTitle}</h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* 🟢 Sync option only appears for Printed Designs */}
                        {(vault === 'printed_designs' || !vault) && <SyncInterface target={vault || 'all'} />}

                        <Button asChild className="bg-[#2A8B8B] hover:bg-[#237070] text-white shadow-md rounded-full px-6">
                            <Link href={`/${locale}/admin/inventory/new`}><Plus className="w-4 h-4 mr-2" /> Add Item</Link>
                        </Button>
                    </div>
                </div>

                {combinedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {combinedProducts.map((product) => (
                            <div key={product.id} className="relative group aspect-square overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
                                <ProductCard product={product} locale={locale} />

                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                                    <DeleteButton id={product.id} vault={product.vault.toLowerCase().replace(' ', '_')} />
                                </div>

                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[8px] font-bold uppercase text-stone-500 z-20">
                                    {product.vault}
                                </div>

                                {product.vault !== 'Printed Designs' && (
                                    <Link
                                        href={`/${locale}/admin/inventory/edit/${product.id}?vault=${product.vault.toLowerCase().replace(' ', '_')}`}
                                        className="absolute bottom-0 left-0 right-0 bg-[#003D4D] py-4 flex items-center justify-center gap-3 text-white translate-y-full group-hover:translate-y-0 transition-all duration-300 z-30"
                                    >
                                        <Edit className="w-5 h-5" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Edit Artisan Piece</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-stone-200">
                        <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-stone-900">Vault is empty</h3>
                    </div>
                )}
            </div>
        </div>
    )
}