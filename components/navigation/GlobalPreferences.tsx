'use client'
import { updateGlobalPreferences } from '@/app/actions/preferences'
import { useTransition } from 'react'

export default function GlobalPreferences({ currentCurrency = 'EUR', currentCountry = 'DE' }) {
    const [isPending, startTransition] = useTransition()

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        // We only want to submit when an input Actually changes. 
        // e.currentTarget gives us the form, we construct FormData from it
        const formData = new FormData(e.currentTarget)
        startTransition(() => {
            updateGlobalPreferences(formData)
        })
    }

    return (
        <form onChange={handleChange} className="flex flex-col gap-4 font-sans">
            <h3 className="font-serif text-lg text-[#004d4d] border-b border-stone-100 pb-2">Regional Settings</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Currency</label>
                    <select
                        name="currency"
                        defaultValue={currentCurrency}
                        disabled={isPending}
                        className="w-full border border-stone-200 p-2 text-sm bg-transparent outline-none focus:border-[#2A8B8B] disabled:opacity-50 transition-colors"
                    >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="AED">AED (د.إ)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Shipping Destination</label>
                    <select
                        name="country"
                        defaultValue={currentCountry}
                        disabled={isPending}
                        className="w-full border border-stone-200 p-2 text-sm bg-transparent outline-none focus:border-[#2A8B8B] disabled:opacity-50 transition-colors"
                    >
                        <option value="DE">Germany</option>
                        <option value="US">United States</option>
                        <option value="AE">United Arab Emirates</option>
                        <option value="GB">United Kingdom</option>
                        <option value="INT">International</option>
                    </select>
                </div>
            </div>

            {isPending && <p className="text-[10px] uppercase tracking-widest text-[#2A8B8B] animate-pulse">Updating vault parameters...</p>}
        </form>
    )
}
