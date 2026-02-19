'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'

export default function PrintingGuide() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('PrintingGuide');

    return (
        <div className="fixed bottom-10 right-10 z-[100]">
            {/* Wider button for text instead of just a circle */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 h-14 bg-[#003D4D] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group border border-teal-400/20"
            >
                <span className="font-serif italic text-sm font-bold tracking-widest uppercase">
                    {t('buttonLabel')}
                </span>
            </button>

            {/* Modal - Enforcing LTR for consistent Artisan aesthetic */}
            {isOpen && (
                <div dir="ltr" className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 z-[110]" onClick={() => setIsOpen(false)}>
                    <div className="bg-white rounded-[2rem] p-10 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] relative" onClick={e => e.stopPropagation()}>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-8 right-8 p-2 hover:bg-stone-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-stone-400" />
                        </button>

                        <h2 className="font-serif text-4xl italic text-[#003D4D] mb-8 pr-12">{t('title')}</h2>

                        <div className="grid gap-8">
                            <div className="border-b border-stone-100 pb-4">
                                <h3 className="font-bold text-lg mb-1">{t('materials.acrylic.title')}</h3>
                                <p className="text-stone-500 text-sm">{t('materials.acrylic.desc')}</p>
                            </div>
                            <div className="border-b border-stone-100 pb-4">
                                <h3 className="font-bold text-lg mb-1">{t('materials.paper.title')}</h3>
                                <p className="text-stone-500 text-sm">{t('materials.paper.desc')}</p>
                            </div>
                            <div className="border-b border-stone-100 pb-4">
                                <h3 className="font-bold text-lg mb-1">{t('materials.aluminum.title')}</h3>
                                <p className="text-stone-500 text-sm">{t('materials.aluminum.desc')}</p>
                            </div>
                        </div>

                        <button onClick={() => setIsOpen(false)} className="mt-10 w-full py-4 bg-stone-100 hover:bg-stone-200 rounded-xl font-serif italic transition-colors">
                            {t('close')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}