import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import PassportTimeline from '@/app/(customer)/passport/[projectId]/timeline' // Reusing the timeline component
import { Metadata } from 'next'

interface TimelineUpdate {
    date: string
    note: string
    image_url: string
}

type Props = {
    params: Promise<{ token: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { token } = await params
    const supabase = await createClient()

    const { data: project } = await supabase
        .from('projects')
        .select('title, progress_updates')
        .eq('share_token', token)
        .single()

    if (!project) return { title: 'Project Not Found' }

    const updates = (project.progress_updates as TimelineUpdate[]) || []
    const latestImage = updates.length > 0 ? updates[0].image_url : '/og-image.jpg' // Fallback image

    return {
        title: `The Journey of ${project.title} | Lara Craft Gifts`,
        description: 'Follow the handcrafted story of this bespoke artisan piece.',
        openGraph: {
            title: `🎥 Project Update: ${project.title}`,
            description: 'See the latest progress from the artisan studio.',
            images: [latestImage],
        }
    }
}

export default async function PublicPassportPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    const supabase = await createClient()

    // Fetch by share_token instead of ID
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('share_token', token)
        .single()

    if (!project) notFound()

    const updates = (project.progress_updates as TimelineUpdate[]) || []

    return (
        <div className="min-h-screen bg-[#fcf8f3] text-stone-800 font-serif py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-24 text-center">
                    <div className="inline-block border-y-4 border-double border-stone-300 py-8 px-12 bg-white shadow-sm">
                        <h1 className="text-4xl md:text-6xl mb-6 italic text-stone-900 font-playfair">{project.title}</h1>
                        <div className="flex items-center justify-center space-x-4">
                            <span className="text-stone-400 font-sans tracking-[0.3em] text-xs uppercase">Project Passport</span>
                            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                            <span className="text-primary font-sans font-medium tracking-widest text-xs uppercase bg-teal-50 px-3 py-1 rounded-full">
                                {project.status}
                            </span>
                        </div>
                    </div>
                </header>

                <PassportTimeline updates={updates} />

                <div className="text-center mt-24">
                    <Link href="/" className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-white transition-colors uppercase tracking-widest text-xs font-sans">
                        Request Your Own Commission <Share2 className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
