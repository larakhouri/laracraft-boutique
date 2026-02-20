'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ProfileEditForm({ profile }: { profile: any }) {
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage('')

        const formData = new FormData(e.currentTarget)
        const updates = {
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            address_line1: formData.get('address_line1'),
            city: formData.get('city'),
            postal_code: formData.get('postal_code'),
            country: formData.get('country'),
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', profile.id)

        setIsSaving(false)
        if (error) {
            setMessage(`Error: ${error.message}`)
        } else {
            setMessage('Profile successfully updated.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            {/* Personal Info */}
            <div>
                <h3 className="font-serif text-xl text-[#004d4d] border-b border-stone-100 pb-2 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Full Name</label>
                        <input name="full_name" defaultValue={profile?.full_name} className="w-full border-b border-stone-200 py-2 outline-none focus:border-[#2A8B8B] bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Phone</label>
                        <input name="phone" defaultValue={profile?.phone} className="w-full border-b border-stone-200 py-2 outline-none focus:border-[#2A8B8B] bg-transparent" />
                    </div>
                </div>
            </div>

            {/* Shipping Info */}
            <div>
                <h3 className="font-serif text-xl text-[#004d4d] border-b border-stone-100 pb-2 mb-4">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Address</label>
                        <input name="address_line1" defaultValue={profile?.address_line1} className="w-full border-b border-stone-200 py-2 outline-none focus:border-[#2A8B8B] bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">City</label>
                        <input name="city" defaultValue={profile?.city} className="w-full border-b border-stone-200 py-2 outline-none focus:border-[#2A8B8B] bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Postal Code</label>
                        <input name="postal_code" defaultValue={profile?.postal_code} className="w-full border-b border-stone-200 py-2 outline-none focus:border-[#2A8B8B] bg-transparent" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Country</label>
                        <input name="country" defaultValue={profile?.country} className="w-full border-b border-stone-200 py-2 outline-none focus:border-[#2A8B8B] bg-transparent" />
                    </div>
                </div>
            </div>

            {message && <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-[#2A8B8B]'}`}>{message}</p>}

            <button type="submit" disabled={isSaving} className="bg-[#004d4d] text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-[#002b36] transition-colors disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Update Profile'}
            </button>
        </form>
    )
}
