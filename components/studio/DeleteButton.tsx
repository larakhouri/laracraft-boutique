'use client'

import { useState } from 'react'
import { deleteProduct } from '@/app/actions/delete-product'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DeleteButton({ id, vault }: { id: string, vault: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove this piece?')) return

        setIsDeleting(true)
        await deleteProduct(id, vault)
        setIsDeleting(false)
    }

    return (
        <Button
            variant="ghost" // Use ghost or custom class to override default button styles effectively
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-stone-400 hover:text-red-600 border border-stone-100 transition-all hover:scale-110 active:scale-90"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}