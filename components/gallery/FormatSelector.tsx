'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function FormatSelector({ variants }: { variants: any[] }) {
    const [selectedId, setSelectedId] = useState(variants[0]?.id || '')
    const activeVariant = variants.find(v => v.id === selectedId) || variants[0]

    return (
        <div className="space-y-6 mt-8">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                    Choose Your Format
                </label>
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full bg-white border border-stone-200 p-4 font-serif text-stone-800 focus:outline-none focus:border-[#004d4d] appearance-none cursor-pointer"
                >
                    {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                            {/* Cleans title to show just "Acrylic" or "Wood Frame" */}
                            {v.title.split('-').pop()?.trim()}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-between items-end border-t border-stone-100 pt-6">
                <div>
                    <p className="text-[10px] uppercase tracking-tighter text-stone-400">Total Investment</p>
                    <p className="text-3xl font-serif text-[#004d4d]">
                        €{activeVariant?.price || '0.00'}
                    </p>
                </div>
                <Button className="bg-[#004d4d] hover:bg-[#003636] text-white px-8 py-6 rounded-none uppercase tracking-widest text-xs font-bold transition-colors">
                    Acquire Print
                </Button>
            </div>
        </div>
    )
}
