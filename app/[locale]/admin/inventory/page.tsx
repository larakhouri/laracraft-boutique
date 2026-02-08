import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package, Edit, ArrowLeft, Plus } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import DeleteButton from '@/components/studio/DeleteButton' // ✅ Add this import

export const dynamic = 'force-dynamic'

export default async function InventoryListPage(props: { params: Promise<{ locale: string }> }) {

    const params = await props.params;
    const locale = params.locale;

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Role check for Lara
    const isLara = user.email === 'lara.khouri19@gmail.com'
    if (!isLara) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role !== 'super_admin' && profile?.role !== 'staff') {
            redirect('/')
        }
    }

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-[#F8F6F1] p-8 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Button asChild variant="link" className="px-0 text-stone-500 hover:text-[#2A8B8B] mb-2">
                            <Link href={`/${locale}/admin/studio`}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Studio</Link>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-serif italic text-stone-800">
                            Inventory Manager
                        </h1>
                        <p className="text-stone-500 italic">Managing your Artisan & Printed collections</p>
                    </div>
                    <Button asChild className="bg-[#2A8B8B] hover:bg-[#237070] text-white shadow-md">
                        <Link href={`/${locale}/admin/inventory/new`}><Plus className="w-4 h-4 mr-2" /> Add New Item</Link>
                    </Button>
                </div>

                {/* Product Grid */}
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="relative group">
                                <ProductCard product={product} locale={locale} />

                                {/* ✅ Action Overlay (Edit & Delete) */}
                                <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                                    <Link
                                        href={`/${locale}/admin/inventory/${product.id}`}
                                        className="bg-white/90 p-2 rounded-full shadow-sm hover:text-[#004d4d] transition-colors"
                                        title="Edit Item"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>

                                    {/* ✅ The Delete Button Component */}
                                    <DeleteButton id={product.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-stone-200">
                        <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-stone-900">No items found</h3>
                        <p className="text-stone-500 mb-6">Start by adding your first creation.</p>
                        <Button asChild className="bg-[#2A8B8B] hover:bg-[#237070] text-white">
                            <Link href={`/${locale}/admin/inventory/new`}>Create Item</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}