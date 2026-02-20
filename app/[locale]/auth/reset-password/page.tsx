'use client'
import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { createClient } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage('')

        // Supabase securely updates the password for the currently verified session
        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Password successfully updated. Returning to your sanctum...')
            setTimeout(() => router.push('/login'), 3000)
        }
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-[#fdfcf8] px-6 font-sans">
            <div className="w-full max-w-md p-8 bg-white border border-stone-200 shadow-sm">
                <h1 className="font-serif text-3xl italic text-[#004d4d] mb-2 text-center">Reset Password</h1>
                <p className="text-stone-500 text-sm text-center mb-8">Enter your new artisan key.</p>

                <form onSubmit={handleReset} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b border-stone-200 py-2 outline-none focus:border-[#2A8B8B] bg-transparent"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-[#2A8B8B] text-sm">{message}</p>}

                    <button type="submit" className="w-full bg-[#004d4d] text-white py-3 text-sm uppercase tracking-widest hover:bg-[#002b36] transition-colors">
                        Secure New Password
                    </button>
                </form>
            </div>
        </div>
    )
}
