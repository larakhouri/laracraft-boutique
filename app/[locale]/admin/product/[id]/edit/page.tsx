import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { updateProduct } from '@/app/actions/update-product' // Ensure this path matches Step 1
import { Save, X } from 'lucide-react'
import Link from 'next/link'

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    )

    // 1. Fetch Existing Data
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) return notFound()

    return (
        <main className="min-h-screen bg-[#fdfcf8] p-6 md:p-12 flex justify-center">
            <div className="w-full max-w-2xl bg-white border border-stone-200 p-8 shadow-sm">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-serif text-3xl text-[#004d4d]">Edit Artifact</h1>
                    <Link href="/inventory" className="text-stone-400 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </Link>
                </div>

                <form action={updateProduct} className="space-y-6">
                    <input type="hidden" name="id" value={product.id} />

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Title</label>
                        <input
                            name="title"
                            defaultValue={product.title}
                            className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#004d4d]"
                        />
                    </div>

                    {/* Row: Price & Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Price (€)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={product.price}
                                className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#004d4d]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Category</label>
                            <select
                                name="category"
                                defaultValue={product.category_slug}
                                className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#004d4d]"
                            >
                                <option value="atelier">The Atelier</option>
                                <option value="supplies">Maker Supplies</option>
                                <option value="gallery">Lens Gallery</option>
                                <option value="printing">Print Studio</option>
                            </select>
                        </div>
                    </div>

                    {/* Description EN */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Description (English)</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={product.description}
                            className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#004d4d]"
                        />
                    </div>

                    {/* Description AR */}
                    <div className="text-right">
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Description (Arabic)</label>
                        <textarea
                            name="description_ar"
                            rows={3}
                            dir="rtl"
                            defaultValue={product.description_ar}
                            className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#004d4d]"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Status</label>
                        <select
                            name="status"
                            defaultValue={product.status || 'published'}
                            className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#004d4d]"
                        >
                            <option value="published">Published (Visible)</option>
                            <option value="draft">Draft (Hidden)</option>
                            <option value="sold">Sold Out</option>
                        </select>
                    </div>

                    <hr className="border-stone-100" />

                    <button type="submit" className="w-full py-4 bg-[#004d4d] text-white font-bold uppercase tracking-widest hover:bg-[#003333] transition flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </form>

            </div>
        </main>
    )
}
