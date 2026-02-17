import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditProductForm from '@/components/studio/EditProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditProductPage(props: { params: Promise<{ id: string, locale: string }> }) {
    const { id, locale } = await props.params;
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) notFound()

    return (
        <div className="min-h-screen bg-[#F8F6F1] p-8 md:p-12">
            <div className="max-w-2xl mx-auto">
                <Link
                    href={locale === 'en' ? '/admin/inventory' : `/${locale}/admin/inventory`}
                    className="flex items-center text-stone-400 hover:text-stone-800 transition-colors mb-8 text-sm uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inventory
                </Link>

                <h1 className="text-4xl font-serif italic text-stone-800 mb-12">Edit Piece</h1>

                <div className="bg-white p-8 rounded-sm shadow-sm">
                    {/* Pass the existing product data to your form */}
                    <EditProductForm
                        product={product}
                        vault="gallery" // Default fallback since this route doesn't seem to track vault
                        targetTable="products"
                        locale={locale}
                    />
                </div>
            </div>
        </div>
    )
}
