'use client'

import { useState, useEffect } from 'react'
import { uploadProduct, syncProducts } from '../actions' // Updated import path
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const initialState = {
    message: '',
    error: '',
}

export default function NewInventoryPage() { // Renamed export
    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [state, setState] = useState(initialState)
    const router = useRouter()
    const supabase = createClient()

    // Force session refresh on mount to ensure roles are up-to-date
    useEffect(() => {
        const refresh = async () => {
            const { error } = await supabase.auth.refreshSession()
            if (error) {
                console.log('Session refresh error:', error)
            } else {
                router.refresh()
            }
        }
        refresh()
    }, [])

    return (
        <div className="min-h-screen bg-[#f4f5f4] p-8 flex flex-col items-center pt-20">
            {/* Breadcrumb */}
            <div className="w-full max-w-xl mb-6">
                <Link href="/inventory" className="inline-flex items-center text-stone-500 hover:text-[#2A8B8B] transition-colors font-sans text-sm tracking-wide">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Inventory
                </Link>
            </div>

            {/* Unauthorized State Override */}
            {state?.error && (state.error.includes('Unauthorized') || state.error.includes('Not authenticated')) ? (
                <Card className="w-full max-w-xl shadow-lg border border-red-100 bg-white rounded-xl overflow-hidden">
                    <div className="bg-red-50 p-6 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-2">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-serif text-stone-800">Access Restricted</h3>
                        <p className="text-stone-500 max-w-sm">
                            You need staff permissions to access the Inventory Manager. Please sign in with an authorized account.
                        </p>
                        <Button onClick={async () => {
                            await supabase.auth.signOut()
                            if (typeof window !== 'undefined') {
                                localStorage.clear()
                                sessionStorage.clear() // for good measure
                            }
                            window.location.href = '/login'
                        }} className="bg-[#2A8B8B] hover:bg-[#237070] text-white w-full max-w-xs mt-4">
                            Return to Login
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card className="w-full max-w-xl shadow-sm border border-[#e5e7eb] bg-white rounded-xl">
                    <CardHeader className="pb-4 border-b border-[#f3f4f6]">
                        <CardTitle className="text-3xl font-serif text-stone-800">New Creation</CardTitle>
                        <CardDescription className="text-stone-500">Add a new artisan item to your collection.</CardDescription>
                        <div className="mt-4 flex justify-center">
                            <form action={async () => {
                                await syncProducts()
                            }}>
                                <Button variant="outline" type="submit" className="border-stone-300 text-stone-600 hover:bg-stone-100">
                                    Sync POD Products
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={async (e) => {
                            e.preventDefault()
                            setIsPending(true)

                            const formData = new FormData(e.currentTarget)
                            const title = formData.get('title') as string
                            const description = formData.get('description') as string
                            const price = parseFloat(formData.get('price') as string)
                            const category = formData.get('category') as string
                            const file = formData.get('image') as File

                            let uploadedFilePath: string | null = null

                            try {
                                // 1. Upload Image
                                const fileExt = file.name.split('.').pop()
                                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                                const filePath = `products/${fileName}` // Pathing: products/ + unique filename

                                const { error: uploadError } = await supabase.storage
                                    .from('products')
                                    .upload(filePath, file)

                                if (uploadError) throw new Error('Image upload failed: ' + uploadError.message)

                                uploadedFilePath = filePath

                                const { data: { publicUrl } } = supabase.storage
                                    .from('products')
                                    .getPublicUrl(filePath)

                                // 2. Submit to API (Insert Product)
                                const response = await fetch('/api/inventory/new', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        title,
                                        description,
                                        price,
                                        category,
                                        image_url: publicUrl,
                                    }),
                                })

                                const result = await response.json()

                                if (!response.ok) {
                                    throw new Error(result.error || 'API Request Failed')
                                }

                                console.log('Insert Result:', result)

                                // 3. Success State
                                setIsSuccess(true)

                                // 4. Redirect after delay
                                setTimeout(() => {
                                    router.push('/admin/studio')
                                    router.refresh()
                                }, 1500)

                            } catch (err: any) {
                                console.error('Save failed:', err.message)

                                // Orphan Cleanup: If upload succeeded but API/Insert failed, delete the image
                                if (uploadedFilePath) {
                                    console.log('Cleaning up orphan image...')
                                    await supabase.storage.from('products').remove([uploadedFilePath])
                                }

                                alert('Error: ' + err.message)
                            } finally {
                                setIsPending(false)
                            }
                        }} className="space-y-5">

                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-[#6b7280]">Product Name</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Product Name"
                                    className="border-[#e5e7eb] focus:ring-[#d1d5db] focus:border-[#9ca3af] bg-[#f9fafb] rounded-lg"
                                    required
                                    disabled={isSuccess}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-sm font-medium text-[#6b7280]">Category</Label>
                                    <Select name="category" required disabled={isSuccess}>
                                        <SelectTrigger className="border-[#e5e7eb] bg-[#f9fafb] rounded-lg focus:ring-[#d1d5db]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="The Bespoke Atelier">The Bespoke Atelier</SelectItem>
                                            <SelectItem value="LaraCraft Originals">LaraCraft Originals</SelectItem>
                                            <SelectItem value="Print & Paper Studio">Print & Paper Studio</SelectItem>
                                            <SelectItem value="The Lens Gallery">The Lens Gallery</SelectItem>
                                            <SelectItem value="Maker Supplies">Maker Supplies</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-sm font-medium text-[#6b7280]">Price</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-[#9ca3af]">$</span>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="pl-7 border-[#e5e7eb] bg-[#f9fafb] rounded-lg focus:ring-[#d1d5db]"
                                            required
                                            disabled={isSuccess}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-[#6b7280]">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Optional description"
                                    className="min-h-[100px] border-[#e5e7eb] bg-[#f9fafb] rounded-lg focus:ring-[#d1d5db]"
                                    disabled={isSuccess}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-sm font-medium text-[#6b7280]">Image</Label>
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#e5e7eb] file:text-[#374151] hover:file:bg-[#d1d5db]"
                                    required
                                    disabled={isSuccess}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending || isSuccess}
                                className={`w-full font-normal py-2.5 rounded-lg transition-all duration-300 ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-[#788e84] hover:bg-[#63756d] text-white'}`}
                            >
                                {isSuccess ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Saved! Redirecting...
                                    </span>
                                ) : (
                                    isPending ? 'Uploading...' : 'Save Item'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
