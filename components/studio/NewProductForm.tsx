'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { analyzeArtisanPiece } from '@/app/actions/ai-analyze'
import { Loader2, Plus, X, Sparkles, Save, Globe, ChevronDown } from 'lucide-react'

export default function NewProductForm({ locale }: { locale: string }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        vault: 'atelier', // Internal Key
        image_url: '',    // Main Hero
        images: [] as string[], // Gallery Array
        desc_en: '',
        desc_de: '',
        desc_ar: ''
    })

    // 1. Unified Table Map (Updated to your new clean schema)
    const tableMap: Record<string, string> = {
        'atelier': 'atelier_products',
        'gallery': 'gallery_products', // 👈 Updated from 'products'
        'printed': 'printed_designs',  // 👈 Pointing to Lara Craft Store table
        'guide': 'printing_guide',     // 👈 Pointing to Printing Guide table
        'gifts': 'FinalGifts',         // 👈 Pointing to Gifts table
        'supplies': 'supplies'         // 👈 Pointing to Maker Supplies table
    }

    // ... (rest of code)

    {/* VAULT SELECTION */ }
    <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
            Destined Vault
        </label>
        <select
            value={formData.vault}
            onChange={(e) => setFormData({ ...formData, vault: e.target.value })}
            className="w-full p-3 bg-white border border-stone-200 text-sm font-serif italic outline-none focus:border-[#2A8B8B] appearance-none cursor-pointer"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
        >
            <option value="atelier" className="not-italic font-sans py-2">The Bespoke Atelier</option>
            <option value="gallery" className="not-italic font-sans py-2">The Lens Gallery</option>
            <option value="supplies" className="not-italic font-sans py-2">Maker Supplies</option>
            <option value="gift" className="not-italic font-sans py-2">Lifestyle & Gifts</option>
            <option value="printed" className="not-italic font-sans py-2">The Printing Guide (Wall Prints)</option> {/* 👈 Updated Label */}
        </select>
    </div>

    // 2. Multi-Upload Handler
    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setLoading(true);

        const uploadedUrls: string[] = [];
        for (const file of files) {
            const path = `uploads/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
            const { error } = await supabase.storage.from('products').upload(path, file);
            if (!error) {
                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path);
                uploadedUrls.push(publicUrl);
            }
        }

        setFormData(prev => ({
            ...prev,
            // First photo becomes Main Hero if empty
            image_url: prev.image_url || uploadedUrls[0],
            images: [...prev.images, ...uploadedUrls]
        }));
        setLoading(false);
    };

    const removeImage = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx),
            image_url: prev.images[idx] === prev.image_url ? (prev.images[0] || '') : prev.image_url
        }));
    };

    // 3. AI Magic (English, German, Arabic)
    const handleMagicFill = async () => {
        if (!formData.image_url) return alert("Upload at least one photo first!");
        setIsAnalyzing(true);
        try {
            const data = await analyzeArtisanPiece(formData.image_url);
            setFormData(prev => ({
                ...prev,
                title: data.title,
                desc_en: data.desc_en,
                desc_de: data.desc_de,
                desc_ar: data.desc_ar
            }));
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* AI HEADER */}
            <div className="flex items-center justify-between p-4 bg-[#003D4D] text-white rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">Artisan Intelligence</p>
                        <p className="text-[8px] opacity-70">Gemini will write your story in 3 languages</p>
                    </div>
                </div>
                <button
                    onClick={handleMagicFill}
                    disabled={isAnalyzing || !formData.image_url}
                    className="px-4 py-2 bg-white text-[#003D4D] hover:bg-stone-100 text-[10px] font-bold rounded shadow-sm disabled:opacity-50"
                >
                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : "MAGIC AUTO-FILL"}
                </button>
            </div>

            <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-8">
                {/* MULTI-PHOTO GALLERY */}
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Artifact Gallery</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-lg border border-stone-200 overflow-hidden bg-stone-100">
                                <img src={url} className="w-full h-full object-cover" />

                                {/* 🔴 REMOVE BUTTON */}
                                <button
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>

                                {/* 🟢 MAIN INDICATOR: Show only on the first/hero image */}
                                {i === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-[#2A8B8B] text-white text-[8px] font-bold uppercase text-center py-1 tracking-widest">
                                        Main
                                    </div>
                                )}
                            </div>
                        ))}
                        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer transition-all">
                            <Plus className="w-6 h-6 text-stone-300" />
                            <span className="text-[8px] uppercase font-bold text-stone-400 mt-2">Add Photo</span>
                            <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* VAULT SELECTION */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                        Destined Vault
                    </label>
                    <select
                        value={formData.vault}
                        onChange={(e) => setFormData({ ...formData, vault: e.target.value })}
                        className="w-full p-3 bg-white border border-stone-200 text-sm font-serif italic outline-none focus:border-[#2A8B8B] appearance-none cursor-pointer"
                        style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
                    >
                        <option value="atelier" className="not-italic font-sans py-2">The Bespoke Atelier</option>
                        <option value="gallery" className="not-italic font-sans py-2">The Lens Gallery (Lara Originals)</option> {/* 👈 Updated Label */}
                        <option value="printed" className="not-italic font-sans py-2">Printed Designs (Lara Craft Store)</option>
                        <option value="guide" className="not-italic font-sans py-2">Printing Guide (Wall Prints)</option>
                        <option value="gifts" className="not-italic font-sans py-2">Final Gifts (Dropshipping)</option>
                        <option value="supplies" className="not-italic font-sans py-2">Maker Supplies</option>
                    </select>
                </div>

                {/* TRILINGUAL STORIES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold text-stone-400 flex items-center gap-2"><Globe className="w-3 h-3" /> English</label>
                        <textarea
                            value={formData.desc_en}
                            onChange={e => setFormData({ ...formData, desc_en: e.target.value })}
                            className="w-full min-h-[120px] p-4 text-sm font-serif italic border border-stone-100 rounded-lg"
                            placeholder="Story..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold text-stone-400 flex items-center gap-2"><Globe className="w-3 h-3" /> German</label>
                        <textarea
                            value={formData.desc_de}
                            onChange={e => setFormData({ ...formData, desc_de: e.target.value })}
                            className="w-full min-h-[120px] p-4 text-sm font-serif italic border border-stone-100 rounded-lg"
                            placeholder="Geschichte..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold text-stone-400 flex items-center gap-2"><Globe className="w-3 h-3" /> Arabic</label>
                        <textarea
                            value={formData.desc_ar}
                            onChange={e => setFormData({ ...formData, desc_ar: e.target.value })}
                            dir="rtl"
                            className="w-full min-h-[120px] p-4 text-sm font-serif border border-stone-100 rounded-lg text-right"
                            placeholder="بالعربية..."
                        />
                    </div>
                </div>

                <button className="w-full py-6 bg-[#003D4D] text-white uppercase tracking-[0.3em] font-bold hover:bg-[#002b36] transition-all flex items-center justify-center gap-3">
                    <Save className="w-5 h-5" /> Save to Vault
                </button>
            </div>
        </div>
    );
}