import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import UpdateForm from './update-form'

export default async function ProjectUpdatePage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params
    const supabase = await createClient()

    // 1. Verify Authentication & Role (Server-Side)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || (profile.role !== 'staff' && profile.role !== 'super_admin')) {
        redirect('/')
    }

    return <UpdateForm projectId={projectId} />
}
