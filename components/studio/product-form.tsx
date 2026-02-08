'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, Plus, UploadCloud, X, Tag, Sparkles } from 'lucide-react'

interface ProductFormProps {
    initialData?: any
}

export function ProductForm({ initialData }: ProductFormProps) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [message, setMessage] = useState('')

    const [imageFiles, setImageFiles] = useState<File[]>([])
    // Initialize tags from initialData or empty array
    const [tags, setTags] = useState<string[]>(initialData?.tags || [])
    const [currentTag, setCurrentTag] = useState('')

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        price: initialData?.price ? String(initialData.price) : '',
        category: initialData?.category_slug || 'atelier',
        description: initialData?.description || '',
        description_ar: initialData?.description_ar || '' // NEW: Arabic Field
    })

    // --- AI MAGIC FUNCTION ---
    const generateInfo = async () => {
        if (imageFiles.length === 0) {
            // Allow generating if there's an existing image URL (though backend might need file)
            // For now, require file upload for AI generation
            alert("Please upload an image first!");
            return;
        }
        setGenerating(true);
        const formPayload = new FormData();
        formPayload.append("image", imageFiles[0]);

        try {
            const res = await fetch("/api/generate", { method: "POST", body: formPayload });
            const data = await res.json();

            if (data.title) {
                setFormData(prev => ({
                    ...prev,
                    title: data.title,
                    price: data.price ? String(data.price) : prev.price,
                    category: data.category || 'atelier',
                    description: data.description,
                    description_ar: data.description_ar || '' // Capture Arabic
                }));
                // Merge tags instead of replacing if editing? Let's treat AI as authoritative for now or append.
                setTags(prev => [...new Set([...prev, ...(data.tags || [])])]);
                setMessage("✨ AI has written your story!");
            }
        } catch (e) {
            console.error(e);
            setMessage("❌ AI Error. Please try again.");
        } finally {
            setGenerating(false);
        }
    };
    // -------------------------

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)])
        }
    }

    const removeFile = (index: number) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index))
    }

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (currentTag.trim() && !tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()])
                setCurrentTag('')
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const uploadedImageUrls: string[] = []

            // Upload Images if any new files
            for (const file of imageFiles) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
                const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file)
                if (uploadError) throw uploadError
                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
                uploadedImageUrls.push(publicUrl)
            }

            // Determine final image URL: New upload > Existing > Empty
            const finalImageUrl = uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : (initialData?.image_url || '')

            const payload = {
                title: formData.title,
                price: parseFloat(formData.price),
                category_slug: formData.category,
                image_url: finalImageUrl,
                images: uploadedImageUrls.length > 0 ? uploadedImageUrls : (initialData?.images || []),
                tags: tags,
                description: formData.description,
                description_ar: formData.description_ar, // Save Arabic
                status: 'published',
                updated_at: new Date().toISOString()
            }

            let error;
            if (initialData?.id) {
                // UPDATE
                const { error: updateError } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', initialData.id)
                error = updateError
            } else {
                // INSERT
                const { error: insertError } = await supabase
                    .from('products')
                    .insert([payload])
                error = insertError
            }

            if (error) throw error
            setMessage(initialData ? '✅ Artifact Updated Successfully!' : '✅ Artifact Saved Successfully!')

            if (!initialData) {
                // Only reset form if creating new
                setFormData({ title: '', price: '', category: 'atelier', description: '', description_ar: '' })
                setImageFiles([]); setTags([]);
            }

        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-6 border border-stone-100 shadow-sm rounded-sm max-w-2xl mx-auto">
            <h3 className="font-serif text-xl text-[#004d4d] mb-6 flex items-center gap-2">
                {initialData ? <Sparkles className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5" />}
                {initialData ? 'Edit Artifact' : 'New Artifact'}
            </h3>

            {/* Image Upload Area */}
            <div className="mb-6">
                <div className="border-2 border-dashed border-stone-200 rounded-sm p-6 text-center hover:bg-stone-50 transition relative">
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <UploadCloud className="w-6 h-6 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-400">Upload Photos (JPEG/PNG)</p>
                </div>

                {/* Existing Image Preview (if editing and no new file) */}
                {initialData?.image_url && imageFiles.length === 0 && (
                    <div className="mt-4 relative w-24 h-24">
                        <img src={initialData.image_url} className="w-full h-full object-cover rounded-sm border border-stone-200" />
                        <span className="absolute bottom-0 right-0 bg-stone-100 text-[10px] px-1 text-stone-500">Current</span>
                    </div>
                )}

                {/* Thumbnails of NEW files */}
                {imageFiles.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                        {imageFiles.map((file, idx) => (
                            <div key={idx} className="relative w-16 h-16 flex-shrink-0">
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-sm" />
                                <button onClick={() => removeFile(idx)} type="button" className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Button */}
            <button
                type="button"
                onClick={generateInfo}
                disabled={generating || imageFiles.length === 0}
                className="w-full py-3 bg-gradient-to-r from-purple-50 to-teal-50 border border-stone-200 text-[#004d4d] font-serif italic mb-6 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
                {generating ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4 text-purple-600" />}
                {generating ? "Consulting the Muse..." : "Auto-Fill details with AI"}
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-500">Title</label>
                        <input type="text" className="w-full p-2 bg-stone-50 border border-stone-100" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-500">Price (€)</label>
                        <input type="number" step="0.01" className="w-full p-2 bg-stone-50 border border-stone-100" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-500">Category</label>
                    <select className="w-full p-2 bg-stone-50 border border-stone-100" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="atelier">The Atelier</option>
                        <option value="supplies">Maker Supplies</option>
                        <option value="gallery">The Lens Gallery</option>
                        <option value="printed-designs">Printed Designs</option>
                    </select>
                </div>

                {/* Tags */}
                <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 block">Tags (Press Enter)</label>
                    <input type="text" className="w-full p-2 bg-stone-50 border border-stone-100 mb-2" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} />
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span key={tag} className="bg-stone-100 text-stone-600 px-2 py-1 text-xs rounded-full flex items-center gap-1">#{tag} <X className="w-3 h-3 cursor-pointer" onClick={() => setTags(tags.filter(t => t !== tag))} /></span>
                        ))}
                    </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-500">Story (English)</label>
                        <textarea rows={4} className="w-full p-2 bg-stone-50 border border-stone-100 text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div dir="rtl">
                        <label className="text-[10px] uppercase tracking-widest text-stone-500">القصة (Arabic)</label>
                        <textarea rows={4} className="w-full p-2 bg-stone-50 border border-stone-100 text-sm font-serif" value={formData.description_ar} onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })} />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-[#004d4d] text-white uppercase tracking-widest text-xs hover:bg-[#003333] transition-colors flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save to Collection"}
                </button>

                {message && <p className="text-center text-sm font-bold mt-2">{message}</p>}
            </form>
        </div>
    )
}
