import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { syncGallery } from '@/app/actions/sync-gallery'
import { syncAllArtisanVaults } from '@/app/actions/sync-gelato'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Package,
    ArrowRight,
    Printer,
    Camera,
    ExternalLink,
    BookOpen,
    RefreshCw
} from 'lucide-react'
import NewProductForm from '@/components/studio/NewProductForm'

export default async function StudioPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect(locale === 'en' ? '/login' : `/${locale}/login`);

    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
    const getPath = (path: string) => locale === 'en' ? path : `/${locale}${path}`;

    return (
        <div className="min-h-screen bg-[#F8F6F1] p-8 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-8">
                    <div>
                        <h2 className="text-sm font-sans tracking-[0.2em] uppercase text-stone-400 mb-2">Command Center</h2>
                        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-800">Artisan Studio</h1>
                    </div>
                    <Button asChild variant="outline" className="border-stone-300 text-stone-600">
                        <Link href={locale === 'en' ? '/' : `/${locale}`}>View Boutique <ExternalLink className="ml-2 w-3 h-3" /></Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* 1. THE LENS GALLERY (GCP CLOUD SYNC) */}
                            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-stone-500">The Lens Gallery</CardTitle>
                                    <Camera className="h-4 w-4 text-stone-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-serif text-stone-800 mb-1">GCP</div>
                                    <p className="text-xs text-stone-400 mb-6 font-sans italic">Syncing from Google Cloud Bucket</p>
                                    {/* 🟢 FIXED: Wrapped in arrow function to avoid return type error */}
                                    <form action={async () => { 'use server'; await syncGallery(); }}>
                                        <Button type="submit" variant="outline" className="w-full border-stone-200 text-stone-600 hover:bg-stone-50">
                                            Sync Bucket
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* 2. PRINTING GUIDE (GELATO SYNC) */}
                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium uppercase text-stone-500">Printing Guide</CardTitle>
                                    <BookOpen className="h-4 w-4 text-[#2A8B8B]" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-serif text-stone-800 mb-1">Guide</div>
                                    <p className="text-xs text-stone-400 mb-6 font-sans italic">Artisan Formats & Specs</p>
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" className="flex-1 border-stone-200">
                                            <Link href={getPath('/admin/inventory?vault=printing_guide')}>View</Link>
                                        </Button>
                                        <form action={async () => { 'use server'; await syncAllArtisanVaults('printing_guide'); }}>
                                            <Button type="submit" className="bg-[#2A8B8B] hover:bg-[#237070] text-white">
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 3. PRINTED DESIGNS (GELATO SYNC) */}
                            <Card className="bg-[#003D4D] border-none shadow-sm text-white">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium uppercase text-stone-300">Printed Designs</CardTitle>
                                    <Printer className="h-4 w-4 text-amber-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-serif mb-1">Gelato</div>
                                    <p className="text-xs text-stone-400 mb-6 italic">Synchronized Collections</p>
                                    <div className="flex flex-col gap-2">
                                        <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                            <Link href={getPath('/admin/inventory?vault=printed_designs')}>View Table</Link>
                                        </Button>
                                        <form action={async () => { 'use server'; await syncAllArtisanVaults('printed_designs'); }}>
                                            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-[#003D4D] font-bold">
                                                Capture Assets
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 4. MASTER INVENTORY */}
                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium uppercase text-stone-500">Inventory</CardTitle>
                                    <Package className="h-4 w-4 text-stone-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-serif text-stone-800 mb-1">{productCount || 0}</div>
                                    <p className="text-xs text-stone-400 mb-6 font-sans">Total database pieces</p>
                                    <Button asChild className="w-full bg-stone-800 hover:bg-stone-700 text-white">
                                        <Link href={getPath('/admin/inventory')}>Manage All <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                    </Button>
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-stone-400 mb-6">Create New Piece</h3>
                            <NewProductForm locale={locale} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}