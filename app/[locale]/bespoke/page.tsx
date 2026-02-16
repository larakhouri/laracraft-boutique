'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { PenTool } from 'lucide-react'

export default function BespokePage() {
    const t = useTranslations('Bespoke');

    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">

            {/* 🔵 BLUE BAND HEADER: Signature Motion Engine */}
            <div className="w-full bg-[#003D4D] py-24 px-12 md:px-24 border-b border-[#002b36] animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                <div className="max-w-[1800px] mx-auto flex flex-col items-center justify-center text-center space-y-6">
                    <div className="p-4 bg-white/5 rounded-full border border-white/10">
                        <PenTool className="w-8 h-8 text-stone-200 stroke-[1px]" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="font-serif text-5xl md:text-7xl text-white italic leading-tight tracking-tight uppercase">
                            Bespoke Commissions
                        </h1>
                        <p className="text-[11px] uppercase tracking-[0.5em] text-stone-400 font-bold italic">
                            Tailored Artisanry • Private Consultations
                        </p>
                    </div>
                </div>
            </div>

            {/* 📝 FORM SECTION: On Gallery Cream Background */}
            <div className="px-6 md:px-12 lg:px-24 py-24 animate-in fade-in duration-1000 delay-500">
                <div className="max-w-3xl mx-auto bg-white border border-stone-200 p-8 md:p-16 shadow-sm rounded-sm">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="font-serif text-3xl text-[#003D4D]">Project Inquiry</h2>
                        <p className="text-stone-500 font-serif italic text-sm">
                            Please describe your vision. I will contact you personally to discuss the chronicle of your piece.
                        </p>
                    </div>

                    <form className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Name</label>
                                <input type="text" className="w-full bg-transparent border-b border-stone-200 py-2 focus:border-[#003D4D] outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Email</label>
                                <input type="email" className="w-full bg-transparent border-b border-stone-200 py-2 focus:border-[#003D4D] outline-none transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Project Details</label>
                            <textarea rows={4} className="w-full bg-transparent border-b border-stone-200 py-2 focus:border-[#003D4D] outline-none transition-colors resize-none" />
                        </div>

                        <div className="pt-8 flex justify-center">
                            <button className="bg-[#003D4D] text-white px-16 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#002b36] transition-all duration-500 shadow-lg">
                                Submit Inquiry →
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}