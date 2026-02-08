import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import PassportTimeline from './timeline'

interface TimelineUpdate {
    date: string
    note: string
    image_url: string
}

export default async function PassportPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params
    const supabase = await createClient()

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (!project) notFound()

    const updates = (project.progress_updates as TimelineUpdate[]) || []

    return (
        <div className="min-h-screen bg-[#fcf8f3] text-stone-800 font-serif py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-stone-500 hover:text-primary transition-colors font-sans text-sm tracking-wide">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Return to Gallery
                    </Link>
                </div>

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

            </div>
        </div>
    )
}
