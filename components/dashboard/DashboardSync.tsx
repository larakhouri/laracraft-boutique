'use client'
import { captureAllGelatoImages } from '@/app/actions/sync-assets'
import { useState } from 'react'
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardSync() {
    const [isSyncing, setIsSyncing] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSync = async () => {
        setIsSyncing(true)
        setStatus('idle')
        try {
            const result = await captureAllGelatoImages()
            if (result.success || result.message) {
                setStatus('success')
                setMessage(result.message || 'Capture complete')
                setTimeout(() => {
                    setStatus('idle')
                    setMessage('')
                }, 3000)
            } else {
                setStatus('error')
            }
        } catch (e) {
            console.error(e)
            setStatus('error')
        }
        setIsSyncing(false)
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-[#003D4D] hover:bg-[#002b36] text-white flex gap-2"
            >
                {isSyncing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                ) : status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                    <RefreshCw className="w-4 h-4" />
                )}
                {isSyncing ? "Capturing to Vault..." : "Capture Gelato Assets"}
            </Button>
            {message && <span className="text-sm text-stone-500 animate-fade-in">{message}</span>}
        </div>
    )
}
