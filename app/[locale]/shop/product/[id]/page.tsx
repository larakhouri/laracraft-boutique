import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Hammer, Sparkles, Send } from 'lucide-react'
import CraftStory from './craft-story'
import ConsultationDrawer from './consultation-drawer'

// 1. Static Optimization: Pre-render all product pages
export async function generateStaticParams() {
    const supabase = await createClient()
    const { data: products } = await supabase.from('products').select('id')

    return products?.map(({ id }) => ({ id })) || []
}

// 2. SEO: Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('title, description')
        .eq('id', id)
        .single()

    if (!product) return { title: 'Product Not Found' }

    return {
        title: `${product.title} | Lara Craft Gifts`,
        description: product.description || `Handcrafted ${product.title} by Lara Craft.`,
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // 3. Data Fetching
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) notFound()

    return (
        <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-stone-500 hover:text-accent transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Gallery
                    </Link>
                </div>

                {/* Main Product Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20 animate-in fade-in duration-700">

                    {/* Image Column */}
                    <div className="space-y-8">
                        <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-stone-100 shadow-md border border-stone-200">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-stone-400">No Image Available</div>
                            )}
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="flex flex-col justify-start space-y-8 pt-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-stone-100 text-stone-500 text-xs font-medium rounded-full mb-3 uppercase tracking-wide">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-4 italic">{product.title}</h1>
                            <p className="text-2xl font-light text-primary">${product.price}</p>
                        </div>

                        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed text-lg font-serif">
                            <p>{product.description || "A unique handcrafted piece, made with care and attention to detail."}</p>
                        </div>

                        {/* Consultation Drawer Replaces Static Form */}
                        <div className="pt-8 border-t border-stone-200">
                            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-serif text-foreground flex items-center italic">
                                        <Sparkles className="w-5 h-5 mr-2 text-primary" />
                                        Interested in this piece?
                                    </h3>
                                    <p className="text-stone-500 text-sm mt-1">
                                        This item is bespoke. Request a customization to make it yours.
                                    </p>
                                </div>
                                {/* The new Responsive Drawer */}
                                <ConsultationDrawer productId={product.id} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Behind the Craft Section */}
                {product.craft_process && product.craft_process.length > 0 && (
                    <CraftStory process={product.craft_process} materials={product.materials || []} />
                )}

            </div>
        </div>
    )
}
