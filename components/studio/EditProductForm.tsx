'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, X, Image as ImageIcon, Plus, CheckCircle2 } from 'lucide-react'

interface EditProductFormProps {
    product: any
    vault: string
    targetTable: string
    locale: string
}

export default function EditProductForm({ product, vault, targetTable, locale }: EditProductFormProps) {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        title: product.title || '',
        price: product.price || 0,
        image_url: product.image_url || '',
        images: product.images || [], // Gallery Photos logic
        description: product.description || ''
    })

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const filePath = `artisan-vault/${Date.now()}-${file.name.replace(/\s/g, '_')}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                image_url: publicUrl
            }));

            console.log("📸 File uploaded successfully:", publicUrl);
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Upload failed. Ensure the 'products' bucket is set to Public.");
        } finally {
            setLoading(false);
        }
    };

    // Gallery Multi-File Upload Logic
    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setLoading(true);
        const newUrls: string[] = [];

        for (const file of files) {
            const path = `gallery/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
            const { data, error } = await supabase.storage.from('products').upload(path, file);

            if (!error) {
                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path);
                newUrls.push(publicUrl);
            }
        }

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newUrls] // Append to existing gallery
        }));
        setLoading(false);
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_: string, index: number) => index !== indexToRemove)
        }));
    };

    const setAsMain = (url: string) => {
        setFormData(prev => ({
            ...prev,
            image_url: url
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 🚀 CACHE BUSTER: Force the browser to see the image as new
            const buster = `?v=${Date.now()}`;
            const finalImageUrl = formData.image_url.includes('?')
                ? `${formData.image_url.split('?')[0]}${buster}`
                : `${formData.image_url}${buster}`;

            const { data, error } = await supabase
                .from(targetTable)
                .update({
                    title: formData.title,
                    price: Number(formData.price),
                    image_url: finalImageUrl,
                    images: formData.images, // 👈 THE GALLERY ARRAY
                    description: formData.description,
                    updated_at: new Date().toISOString()
                })
                .eq('id', product.id)
                .select(); // ✅ Confirming the update actually happened

            if (error) throw error

            if (data && data.length > 0) {
                setSuccess(true);
                router.refresh();

                // Small delay for the visual "Success" feedback before redirecting
                setTimeout(() => {
                    router.push(`/${locale}/admin/inventory`);
                }, 800);
            } else {
                alert("Warning: No changes were detected or saved.");
            }

        } catch (err) {
            console.error("Sync Error:", err);
            alert("Save failed. Check your connection or database permissions.");
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-500">
            {/* Live Status Overlay */}
            {success && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Changes Synced Successfully</span>
                </div>
            )}

            {/* Visual Preview */}
            <div className="flex items-center gap-6 p-4 bg-stone-50 rounded-lg border border-stone-100">
                <div className="w-24 h-24 rounded bg-white border border-stone-200 overflow-hidden flex-shrink-0 shadow-inner">
                    {formData.image_url ? (
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover transition-opacity duration-300" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="text-sm font-serif italic text-[#003D4D]">Artisan Preview</h4>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Vault Location: {vault}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">Product Title</label>
                    <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-transparent border-stone-200 focus:ring-[#2A8B8B] rounded-none h-12"
                        placeholder="e.g. The Midnight Chronicle"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">Price (€)</label>
                    <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="bg-transparent border-stone-200 rounded-none h-12"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {/* PRIMARY PHOTO SECTION */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Primary Artifact Photo</label>
                    <div className="relative h-64 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 flex items-center justify-center overflow-hidden group">
                        {formData.image_url ? (
                            <img src={formData.image_url} className="w-full h-full object-cover" />
                        ) : (
                            <Plus className="text-stone-300" />
                        )}
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>

                {/* GALLERY GRID SECTION */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Supporting Gallery ({formData.images.length})</label>
                    <div className="grid grid-cols-4 gap-4">
                        {formData.images.map((url: string, index: number) => {
                            const isMain = formData.image_url === url;
                            return (
                                <div key={index} className={`relative aspect-square rounded-lg border border-stone-200 overflow-hidden group ${isMain ? 'border-[#2A8B8B] shadow-md' : ''}`}>
                                    <img src={url} className="w-full h-full object-cover" />

                                    {/* REMOVE */}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>

                                    {/* SET AS MAIN */}
                                    {!isMain && (
                                        <button
                                            type="button"
                                            onClick={() => setAsMain(url)}
                                            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest z-10"
                                        >
                                            Set as Main
                                        </button>
                                    )}

                                    {/* INDICATOR */}
                                    {isMain && (
                                        <div className="absolute bottom-0 inset-x-0 bg-[#2A8B8B] text-white text-[8px] font-bold uppercase text-center py-1 tracking-widest">
                                            Primary Hero
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {/* The "Add More" Square */}
                        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer transition-all">
                            <Plus className="w-5 h-5 text-stone-300" />
                            <span className="text-[8px] uppercase font-bold text-stone-400 mt-1">Add Detail</span>
                            <input type="file" multiple onChange={handleGalleryUpload} className="hidden" />
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">Story & Description</label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-transparent border-stone-200 min-h-[150px] font-serif italic text-base leading-relaxed rounded-none"
                    placeholder="Tell the story of this piece..."
                />
            </div>

            <div className="flex gap-4 pt-6 border-t border-stone-100">
                <Button
                    type="submit"
                    disabled={loading || success}
                    className="flex-1 bg-[#003D4D] hover:bg-[#002b36] text-white py-8 rounded-none transition-all disabled:bg-stone-200"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Commit Changes</>}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="px-10 border-stone-200 text-stone-500 hover:bg-stone-50 rounded-none h-auto"
                >
                    <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
            </div>
        </form>
    )
}