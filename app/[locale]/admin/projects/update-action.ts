'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { ensureStorageBucket } from '@/utils/supabase/storage'

export async function uploadProjectUpdate(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Verify Role (Server-Side Security)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated', message: '' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || (profile.role !== 'staff' && profile.role !== 'super_admin')) {
        return { error: 'Unauthorized access. Staff only.', message: '' }
    }

    // 2. Process Inputs
    const projectId = formData.get('projectId') as string
    const note = formData.get('note') as string
    const imageFile = formData.get('image') as File

    if (!projectId || !note) {
        return { error: 'Project ID and Note are required.', message: '' }
    }

    let imageUrl = ''

    // 3. Upload Image
    if (imageFile && imageFile.size > 0) {
        await ensureStorageBucket('product-images')

        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${projectId}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, imageFile)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return { error: 'Failed to upload image.', message: '' }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

        imageUrl = publicUrl
    }

    // 4. Update Database (JSONB Append)
    const newUpdate = {
        date: new Date().toISOString(),
        note: note,
        image_url: imageUrl
    }

    // Fetch existing updates
    const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('progress_updates')
        .eq('id', projectId)
        .single()

    if (fetchError) {
        return { error: 'Failed to fetch project.', message: '' }
    }

    const existingUpdates = (project.progress_updates as any[]) || []
    const updatedUpdates = [newUpdate, ...existingUpdates]

    const { error: updateError } = await supabase
        .from('projects')
        .update({
            progress_updates: updatedUpdates,
            updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

    if (updateError) {
        return { error: 'Failed to save update.', message: '' }
    }

    revalidatePath(`/passport/${projectId}`)
    revalidatePath(`/admin/projects`)

    return { success: true, message: 'The Journey has been updated!', error: '' }
}
