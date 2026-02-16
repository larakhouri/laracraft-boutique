import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package, RefreshCw, Sparkles, Image as ImageIcon, Briefcase, Scroll } from 'lucide-react'
import { revalidateRole } from '@/app/[locale]/actions/auth'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

// Mock Data for "Basement Inventory" Preview
const FEATURED_ARTIFACTS = [
    {
        id: '2',
        title: 'Bespoke Turquoise Pendant',
        category: 'LaraCraft Originals',
        price: 890,
        image_url: '/product-pendant.jpg'
    },
    {
        id: '3',
        title: 'Artisan Leather Journal',
        category: 'Print & Paper Studio',
        price: 120,
        image_url: '/product-journal.jpg'
    },
    {
        id: '1',
        title: 'Hand-Hammered Gold Ring',
        category: 'Bespoke Atelier',
        price: 1250,
        image_url: '/product-ring.jpg'
    }
]

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
    const supabase = await createClient()
    const { locale } = await params
    const tDiscovery = await getTranslations({ locale, namespace: 'Discovery' })
    const tNav = await getTranslations({ locale, namespace: 'Navigation' })

    // 1. Verify User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // 3. Fetch User's Projects (Journeys)
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', user.id)
        .order('updated_at', { ascending: false })

    // 4. Fetch Featured Artifacts (Published Only)
    const { data: featuredArtifacts } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .limit(3);

    return (
        <div className="min-h-screen bg-[#F8F6F1] pb-20">
            {/* Hero / Welcome */}
            <div className="bg-white border-b border-stone-100 py-12 px-12 md:px-32">
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-serif text-stone-800 italic">Studio Preview</h1>
                            <Badge variant="outline" className="border-[#2A8B8B] text-[#2A8B8B] font-sans tracking-widest text-[10px] uppercase">
                                Internal View
                            </Badge>
                        </div>
                        <p className="text-stone-500 max-w-lg">
                            Welcome back, {profile?.full_name || 'Artisan'}. Here is a snapshot of active commissions and the latest from the basement inventory.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {(profile?.role === 'super_admin' || user.email === 'lara.khouri19@gmail.com') && (
                            <Button asChild variant="outline" className="border-stone-200 hover:border-[#2A8B8B] hover:text-[#2A8B8B] text-stone-600 font-serif">
                                <Link href={`/${locale}/admin/studio`}>🎨 Enter Studio</Link>
                            </Button>
                        )}
                        <form action={revalidateRole}>
                            <Button variant="ghost" size="icon" title="Force Sync Role" className="h-9 w-9 text-stone-300 hover:text-[#2A8B8B]">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="w-full px-12 md:px-32 py-12 space-y-16">

                {/* 1. Studio Departments (Discovery Cards) */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-xl font-serif text-stone-800">Studio Departments</h2>
                        <div className="h-px bg-stone-200 flex-grow" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Gallery Card */}
                        <div className="group relative overflow-hidden bg-white border border-stone-200/60 p-8 transition-all duration-500 hover:shadow-lg hover:border-[#2A8B8B]/30">
                            <div className="mb-4 text-[#2A8B8B]">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-2xl mb-3 tracking-wide text-stone-800">
                                {tNav('gallery')}
                            </h3>
                            <p className="font-sans text-stone-500 text-sm leading-relaxed mb-6 tracking-wide max-w-sm">
                                {tDiscovery('gallery_desc')}
                            </p>
                            <Link href={`/${locale}/gallery`} className="text-xs font-bold tracking-[0.2em] uppercase text-[#2A8B8B] hover:text-stone-800 transition-colors">
                                {tDiscovery('explore_btn')} &rarr;
                            </Link>
                        </div>

                        {/* Supplies Card */}
                        <div className="group relative overflow-hidden bg-white border border-stone-200/60 p-8 transition-all duration-500 hover:shadow-lg hover:border-[#2A8B8B]/30">
                            <div className="mb-4 text-[#2A8B8B]">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-2xl mb-3 tracking-wide text-stone-800">
                                {tNav('supplies')}
                            </h3>
                            <p className="font-sans text-stone-500 text-sm leading-relaxed mb-6 tracking-wide max-w-sm">
                                {tDiscovery('supplies_desc')}
                            </p>
                            <Link href={`/${locale}/supplies`} className="text-xs font-bold tracking-[0.2em] uppercase text-[#2A8B8B] hover:text-stone-800 transition-colors">
                                {tDiscovery('explore_btn')} &rarr;
                            </Link>
                        </div>

                        {/* Printed Designs Card */}
                        <div className="group relative overflow-hidden bg-white border border-stone-200/60 p-8 transition-all duration-500 hover:shadow-lg hover:border-[#2A8B8B]/30">
                            <div className="mb-4 text-[#2A8B8B]">
                                <Scroll className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-2xl mb-3 tracking-wide text-stone-800">
                                {tNav('printed')}
                            </h3>
                            <p className="font-sans text-stone-500 text-sm leading-relaxed mb-6 tracking-wide max-w-sm">
                                {tDiscovery('pod_desc')}
                            </p>
                            <Link href={`/${locale}/printed-designs`} className="text-xs font-bold tracking-[0.2em] uppercase text-[#2A8B8B] hover:text-stone-800 transition-colors">
                                {tDiscovery('explore_btn')} &rarr;
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 2. Featured Artifacts (Basement Inventory) */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-serif text-stone-800">Featured Artifacts</h2>
                            <span className="text-xs text-stone-400 uppercase tracking-widest pl-4 border-l border-stone-200">From The Atelier</span>
                        </div>
                        <Link href={`/${locale}/shop`} className="text-xs font-sans uppercase tracking-widest text-stone-400 hover:text-[#2A8B8B] transition-colors">
                            View All Inventory &rarr;
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {featuredArtifacts?.map((product: any) => (
                            <Link key={product.id} href={`/${locale}/shop`} className="group block bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all">
                                <div className="aspect-square relative bg-stone-100 overflow-hidden">
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-stone-300 font-serif italic bg-stone-50">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">{product.category_slug || 'Artifact'}</span>
                                    <h4 className="font-serif text-lg text-stone-800 group-hover:text-[#2A8B8B] transition-colors">{product.title}</h4>
                                    <span className="text-sm font-medium text-[#c5a065] mt-2 block">${product.price}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 3. My Journeys (Existing) */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                        <h2 className="text-xl font-serif text-stone-700">My Journeys</h2>
                        <span className="text-xs text-stone-400 uppercase tracking-widest">Active Commissions</span>
                    </div>

                    {projects && projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Link key={project.id} href={`/passport/${project.id}`} className="group block">
                                    <Card className="h-full bg-white border-stone-200 shadow-sm hover:shadow-md transition-shadow group-hover:border-[#2A8B8B]/50 overflow-hidden">
                                        <div className="h-2 bg-[#2A8B8B] w-full" />
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline" className="border-stone-200 text-stone-500 font-normal">
                                                    {project.status}
                                                </Badge>
                                                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#2A8B8B] transition-colors" />
                                            </div>
                                            <CardTitle className="font-serif text-xl group-hover:text-[#2A8B8B] transition-colors">
                                                {project.title}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2 text-xs uppercase tracking-wide">
                                                Commissioned {new Date(project.created_at).toLocaleDateString()}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm text-stone-500">
                                                {project.progress_updates && Array.isArray(project.progress_updates)
                                                    ? `${project.progress_updates.length} Updates Logged`
                                                    : 'No updates yet'}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border md:border-dashed border-stone-200 rounded-lg p-12 text-center space-y-4">
                            <div className="mx-auto w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
                                <Package className="w-6 h-6" />
                            </div>
                            <h3 className="font-serif text-lg text-stone-600">No active journeys found</h3>
                            <p className="text-stone-400 text-sm max-w-md mx-auto">
                                You haven't commissioned any bespoke pieces yet. Visit our boutique to start your journey.
                            </p>
                            <Button asChild className="mt-4 bg-[#2A8B8B] hover:bg-[#237070] text-white">
                                <Link href="/?category=Bespoke">Explore Bespoke</Link>
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
