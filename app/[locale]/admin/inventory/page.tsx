import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package, Edit, ArrowLeft, Plus, Bookmark } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import DeleteButton from '@/components/studio/DeleteButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0; // 👈 Forces the page to fetch fresh data on every visit


export default async function InventoryListPage(props: { params: Promise<{ locale: string }> }) {

    const params = await props.params;
    const locale = params.locale;

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Role check
    const isLara = user.email === 'lara.khouri19@gmail.com'
    if (!isLara) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role !== 'super_admin' && profile?.role !== 'staff') {
            redirect('/')
        }
    }

    // --- 🚀 MASTER FETCH: Query all 3 Vaults simultaneously ---
    const [resGallery, resAtelier, resSupplies] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('atelier_products').select('*').order('updated_at', { ascending: false }),
        supabase.from('supplies_products').select('*').order('updated_at', { ascending: false })
    ]);

    // Combine data and add a 'vault' label to keep track of the source
    const combinedProducts = [
        ...(resGallery.data || []).map(p => ({ ...p, vault: 'Gallery' })),
        ...(resAtelier.data || []).map(p => ({ ...p, vault: 'Atelier' })),
        ...(resSupplies.data || []).map(p => ({ ...p, vault: 'Supplies' }))
    ].sort((a, b) => new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime());

    return (
        <div className="min-h-screen bg-[#F8F6F1] p-8 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Button asChild variant="link" className="px-0 text-stone-500 hover:text-[#2A8B8B] mb-2">
                            <Link href={`/${locale}/admin/studio`}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Studio</Link>
                        </Button>
                        <h1 className="text-4xl font-serif italic text-stone-800">
                            Universal Inventory
                        </h1>
                        <p className="text-stone-500 italic">Centralized management for all 6 artisan vaults</p>
                    </div>
                    <Button asChild className="bg-[#2A8B8B] hover:bg-[#237070] text-white shadow-md">
                        <Link href={`/${locale}/admin/inventory/new`}><Plus className="w-4 h-4 mr-2" /> Add New Item</Link>
                    </Button>
                </div>

                {/* Vault Legend */}
                <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold text-stone-400">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400" /> Gallery</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> Atelier</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Supplies</span>
                </div>

                {/* Product Grid */}
                {combinedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {combinedProducts.map((product) => (
                            <div key={product.id} className="relative group aspect-square overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
                                <ProductCard product={product} locale={locale} />

                                {/* 🗑️ SAFETY DELETE: Isolated top-right, w-10 h-10 */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                                    <DeleteButton id={product.id} vault={product.vault.toLowerCase()} />
                                </div>

                                {/* 🏷️ VAULT TAG: Stays visible */}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[8px] font-bold uppercase tracking-tighter text-stone-500 border border-stone-100 z-20">
                                    {product.vault}
                                </div>

                                {/* ✏️ BIG EDIT BAR: Massive target area at the bottom */}
                                <Link
                                    href={`/${locale}/admin/inventory/edit/${product.id}?vault=${product.vault.toLowerCase()}`}
                                    className="absolute bottom-0 left-0 right-0 bg-[#003D4D] py-4 flex items-center justify-center gap-3 text-white translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-in-out z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]"
                                >
                                    <Edit className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans">
                                        Edit Artisan Piece
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-stone-200">
                        <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-stone-900">Vaults are empty</h3>
                        <Button asChild className="mt-4 bg-[#2A8B8B] hover:bg-[#237070] text-white">
                            <Link href={`/${locale}/admin/inventory/new`}>Create Item</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}