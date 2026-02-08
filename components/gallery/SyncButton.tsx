'use client'

import { useTransition } from 'react'
import { syncGallery } from '@/app/actions/sync-gallery'
import { Button } from '@/components/ui/button'
import { Camera, Loader2 } from 'lucide-react'

export default function SyncButton() {
    const [isPending, startTransition] = useTransition()

    const handleSync = () => {
        // This log will appear in your BROWSER console
        console.log("Gallery Sync Initiated...");
        startTransition(async () => {
            const result = await syncGallery()
            // Check the browser console for this result
            console.log("Gallery Sync Result:", result)
        })
    }

    return (
        <Button
            onClick={handleSync}
            disabled={isPending}
            variant="outline"
            className="border-stone-200 text-stone-600 hover:bg-stone-50"
        >
            {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...</>
            ) : (
                <><Camera className="mr-2 h-4 w-4" /> Sync Cloud Bucket</>
            )}
        </Button>
    )
}
