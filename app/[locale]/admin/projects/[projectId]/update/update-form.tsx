'use client'

import { useActionState } from 'react'
import { uploadProjectUpdate } from '../../update-action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Camera, Upload, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const initialState = {
    success: false,
    message: '',
    error: ''
}

export default function UpdateForm({ projectId }: { projectId: string }) {
    const [state, formAction, isPending] = useActionState(uploadProjectUpdate, initialState)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        if (state.success) {
            setShowToast(true)
            const timer = setTimeout(() => setShowToast(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [state.success])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F6F1] font-sans text-stone-800 pb-safe">
            <header className="bg-white border-b border-stone-200 p-4 sticky top-0 z-20 shadow-sm">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <Link href="/admin/projects" className="text-primary hover:text-primary/80">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="font-serif italic text-xl text-stone-900">Artisan Studio</h1>
                    <div className="w-6"></div> {/* Spacer for balance */}
                </div>
            </header>

            <main className="p-4 max-w-md mx-auto pt-8">
                <Card className="border-stone-100 shadow-md overflow-hidden bg-white">
                    <CardHeader className="bg-stone-50 border-b border-stone-100 pb-4">
                        <CardTitle className="text-center font-serif text-2xl italic text-primary">
                            Update Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form action={formAction} className="space-y-8">
                            <input type="hidden" name="projectId" value={projectId} />

                            {/* Camera / Image Input */}
                            <div className="space-y-4">
                                <Label htmlFor="image" className="block text-center text-sm font-medium uppercase tracking-widest text-stone-400">
                                    Snap a Photo
                                </Label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-colors ${previewUrl ? 'border-primary border-solid' : 'border-stone-300 bg-stone-50'}`}>
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <>
                                                <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                                                    <Camera className="w-8 h-8 text-primary" />
                                                </div>
                                                <span className="text-stone-500 font-medium">Tap to Open Camera</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Note Input */}
                            <div className="space-y-4">
                                <Label htmlFor="note" className="block text-center text-sm font-medium uppercase tracking-widest text-stone-400">
                                    Note from the Studio
                                </Label>
                                <Textarea
                                    name="note"
                                    id="note"
                                    placeholder="e.g. Applying the final finish..."
                                    className="min-h-[120px] text-lg font-serif italic text-stone-700 bg-stone-50/50 border-stone-200 focus:border-primary focus:ring-primary rounded-lg p-4 resize-none shadow-inner"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-16 text-xl font-serif italic bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform active:scale-95"
                            >
                                {isPending ? 'Sending Update...' : 'Push Update to Passport'}
                            </Button>

                            {state?.error && (
                                <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded">{state.error}</p>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </main>

            {/* Custom Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4"
                    >
                        <div className="bg-white border border-stone-200 shadow-xl rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-serif font-medium text-stone-800">Journey Updated</h4>
                                    <p className="text-xs text-stone-500">Customer notification sent.</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowToast(false)}
                                className="text-stone-400 hover:text-stone-600"
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
