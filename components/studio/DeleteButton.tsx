'use client'

import { useState } from 'react'
import { deleteProduct } from '@/app/actions/delete-product'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DeleteButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove this piece?')) return

        setIsDeleting(true)
        await deleteProduct(id)
        setIsDeleting(false)
    }

    return (
        <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 rounded-full shadow-sm"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}