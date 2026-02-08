import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { importGelatoProducts } from '@/app/actions/import-gelato'
import { syncGallery } from '@/app/actions/sync-gallery'
import SyncButton from '@/components/admin/SyncButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Package,
    MessageCircle,
    ArrowRight,
    Printer,
    Camera,
    LayoutDashboard,
    ExternalLink
} from 'lucide-react'
import { ProductForm } from '@/components/studio/product-form'

export default async function StudioPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Protect the route - Clean URL aware redirect
    if (!user) {
        redirect(locale === 'en' ? '/login' : `/${locale}/login`);
    }

    // 2. Fetch Inventory Stats
    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    // 3. Fetch Recent Inventory for Grid
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12)

    // 🟢 3. Helper for Clean URLs (Removes /en/ prefix for default language)
    const getPath = (path: string) => locale === 'en' ? path : `/${locale}${path}`;

    return (
        <div className="min-h-screen bg-[#F8F6F1] p-8 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-8">
                    <div>
                        <h2 className="text-sm font-sans tracking-[0.2em] uppercase text-stone-400 mb-2">Command Center</h2>
                        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-800">
                            Artisan Studio
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <Button asChild variant="outline" className="border-stone-300 text-stone-600 hover:bg-stone-50">
                            {/* Fixed Boutique Link */}
                            <Link href={locale === 'en' ? '/' : `/${locale}`}>
                                View Boutique <ExternalLink className="ml-2 w-3 h-3" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left & Middle Column: Analytics and Integrations */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Inventory Summary */}
                            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-stone-500">Inventory</CardTitle>
                                    <Package className="h-4 w-4 text-stone-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-serif text-stone-800 mb-1">{productCount || 0}</div>
                                    <p className="text-xs text-stone-400 mb-6 font-sans">Total pieces in database</p>
                                    <Button asChild className="w-full bg-stone-800 hover:bg-stone-700 text-white">
                                        {/* 🟢 FIXED: Dynamic Path to Inventory */}
                                        <Link href={getPath('/admin/inventory')}>
                                            Manage Items <ArrowRight className="ml-2 w-4 h-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Lens Gallery Sync (Google Cloud) */}
                            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-stone-500">The Lens Gallery</CardTitle>
                                    <Camera className="h-4 w-4 text-stone-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-serif text-stone-800 mb-1">GCP</div>
                                    <p className="text-xs text-stone-400 mb-6 font-sans italic">Sync your Google Cloud bucket</p>

                                    {/* Action Wrapper fixes TypeScript mismatch */}
                                    <form action={async () => {
                                        'use server'
                                        await syncGallery();
                                    }}>
                                        <Button type="submit" variant="outline" className="w-full border-stone-200 text-stone-600 hover:bg-stone-50">
                                            Sync Bucket
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Print Studio Sync (Gelato) */}
                            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-stone-500">Printed Designs</CardTitle>
                                    <Printer className="h-4 w-4 text-stone-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-serif text-stone-800 mb-1">Gelato</div>
                                    <p className="text-xs text-stone-400 mb-6 font-sans italic">Import your printed collection</p>

                                    {/* Action Wrapper fixes TypeScript mismatch */}
                                    <SyncButton />
                                </CardContent>
                            </Card>

                            {/* Inquiries Card */}
                            <Card className="bg-white border-none shadow-sm opacity-60">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-stone-500">Inquiries</CardTitle>
                                    <MessageCircle className="h-4 w-4 text-stone-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-serif text-stone-300 mb-1">0</div>
                                    <p className="text-xs text-stone-400 mb-6 font-serif italic">Pending customer requests</p>
                                    <Button disabled variant="outline" className="w-full border-dashed border-stone-200 text-stone-300">
                                        Messaging Locked
                                    </Button>
                                </CardContent>
                            </Card>

                        </div>

                        {/* Visual Separator */}
                        <div className="pt-8">
                            <div className="flex items-center gap-4 opacity-20">
                                <div className="h-px bg-stone-800 flex-1"></div>
                                <LayoutDashboard className="w-4 h-4 text-stone-800" />
                                <div className="h-px bg-stone-800 flex-1"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Manual Product Entry */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-stone-400 mb-6">Create New Piece</h3>
                            <ProductForm />
                        </div>
                    </div>
                </div>

            </div>
        </div >
    )
}