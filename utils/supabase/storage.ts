import { createClient } from './server'

export async function ensureStorageBucket(bucketName: string) {
    const supabase = await createClient()
    const { data: buckets } = await supabase.storage.listBuckets()

    const bucketExists = buckets?.find((b) => b.name === bucketName)

    if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 1024 * 1024 * 5, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
        })

        if (error) {
            console.error('Error creating bucket:', error)
            return false
        }
    }

    return true
}
