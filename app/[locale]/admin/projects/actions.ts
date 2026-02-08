'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { ensureStorageBucket } from '@/utils/supabase/storage'
import { z } from 'zod'

export async function updateProjectProgress(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Verify Role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated', message: '' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || (profile.role !== 'staff' && profile.role !== 'super_admin')) {
        return { error: 'Unauthorized access', message: '' }
    }

    // 2. Validate Input
    const projectId = formData.get('projectId') as string
    const note = formData.get('note') as string
    const file = formData.get('image') as File

    if (!projectId || !note || !file || file.size === 0) {
        return { error: 'Missing required fields', message: '' }
    }

    // 3. Ensure Bucket & Upload Image
    await ensureStorageBucket('project-updates')

    const fileExt = file.name.split('.').pop()
    const fileName = `${projectId}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('project-updates')
        .upload(filePath, file)

    if (uploadError) {
        return { error: 'Image upload failed: ' + uploadError.message, message: '' }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('project-updates')
        .getPublicUrl(filePath)

    // 4. Update Project JSONB
    // First fetch existing updates
    const { data: project } = await supabase
        .from('projects')
        .select('progress_updates')
        .eq('id', projectId)
        .single()

    if (!project) return { error: 'Project not found', message: '' }

    const currentUpdates = project.progress_updates || []
    const newUpdate = {
        date: new Date().toISOString(),
        note,
        image_url: publicUrl
    }

    // Append new update to the beginning (latest first) or end, depending on preference.
    // Let's do latest first for the timeline usually.
    const updatedUpdates = [newUpdate, ...currentUpdates]

    const { error: updateError } = await supabase
        .from('projects')
        .update({
            progress_updates: updatedUpdates,
            updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

    if (updateError) {
        return { error: 'Failed to update ledger: ' + updateError.message, message: '' }
    }

    revalidatePath('/projects')
    revalidatePath(`/passport/${projectId}`) // Revalidate customer view too
    return { message: 'Progress recorded successfully!', error: '' }
}
