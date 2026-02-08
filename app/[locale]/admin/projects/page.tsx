import { createClient } from '@/utils/supabase/server'
import UpdateForm from './update-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

import ProjectShare from './project-share'

export default async function ProjectsPage() {
    const supabase = await createClient()

    // Fetch all projects for the list
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-stone-500 hover:text-[#2A8B8B] transition-colors font-sans text-sm tracking-wide">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shop
                </Link>
            </div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-stone-800">Project Management</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Update Tool */}
                <div className="lg:col-span-1">
                    <UpdateForm projects={projects || []} />
                </div>

                {/* Right Column: Project List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold text-stone-700 mb-4">Active Passports</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {projects?.map((project) => (
                            <ProjectShare key={project.id} project={project} />
                        ))}
                    </div>
                    {(!projects || projects.length === 0) && (
                        <p className="text-stone-500">No active projects found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
