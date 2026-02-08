'use client'

import { useState, useEffect, use } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function EditInventoryPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id } = use(params)

    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (data) {
                setProduct(data)
            }
            if (error) {
                console.error('Error fetching product:', error)
            }
            setLoading(false)
        }
        fetchProduct()
    }, [id, supabase])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)

        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const category = formData.get('category') as string
        const file = formData.get('image') as File

        try {
            let imageUrl = product.image_url

            // 1. Handle Image Upload if new file selected (size > 0)
            if (file && file.size > 0) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `products/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file)

                if (uploadError) throw new Error('Image upload failed: ' + uploadError.message)

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath)

                imageUrl = publicUrl
            }

            // 2. Update Record
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    title,
                    description,
                    price,
                    category,
                    image_url: imageUrl
                })
                .eq('id', id)

            if (updateError) throw updateError

            setIsSuccess(true)

            setTimeout(() => {
                router.push('/admin/inventory') // Or back to studio? User said "redirect to /admin/studio" in previous turn for New. For Edit, usually back to list.
                // Inventory List has "Back to Studio" link.
                router.refresh()
            }, 1000)

        } catch (error: any) {
            console.error('Update failed:', error)
            alert('Update failed: ' + error.message)
        } finally {
            setIsPending(false)
        }
    }

    if (loading) {
        return <div className="p-20 text-center text-stone-500">Loading product details...</div>
    }

    if (!product) {
        return <div className="p-20 text-center text-red-500">Product not found.</div>
    }

    return (
        <div className="min-h-screen bg-[#f4f5f4] p-8 flex flex-col items-center pt-20">
            {/* Breadcrumb */}
            <div className="w-full max-w-xl mb-6">
                <Link href="/admin/inventory" className="inline-flex items-center text-stone-500 hover:text-[#2A8B8B] transition-colors font-sans text-sm tracking-wide">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Inventory
                </Link>
            </div>

            <Card className="w-full max-w-xl shadow-sm border border-[#e5e7eb] bg-white rounded-xl">
                <CardHeader className="pb-4 border-b border-[#f3f4f6]">
                    <CardTitle className="text-3xl font-serif text-stone-800">Edit Details</CardTitle>
                    <CardDescription className="text-stone-500">Update product information.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium text-[#6b7280]">Product Name</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={product.title}
                                className="border-[#e5e7eb] bg-[#f9fafb] rounded-lg"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-medium text-[#6b7280]">Category</Label>
                                <Select name="category" defaultValue={product.category} required>
                                    <SelectTrigger className="border-[#e5e7eb] bg-[#f9fafb] rounded-lg">
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
                                        defaultValue={product.price}
                                        className="pl-7 border-[#e5e7eb] bg-[#f9fafb] rounded-lg"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-[#6b7280]">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={product.description}
                                className="min-h-[100px] border-[#e5e7eb] bg-[#f9fafb] rounded-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-sm font-medium text-[#6b7280]">Update Image (Optional)</Label>
                            <div className="flex items-center gap-4 mb-2">
                                {product.image_url && (
                                    <div className="relative w-16 h-16 rounded overflow-hidden border">
                                        <Image src={product.image_url} alt="Current" fill className="object-cover" />
                                    </div>
                                )}
                                <span className="text-xs text-stone-400">Current Image</span>
                            </div>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#e5e7eb] file:text-[#374151] hover:file:bg-[#d1d5db]"
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
                                    Updated! Redirecting...
                                </span>
                            ) : (
                                isPending ? 'Updating...' : 'Save Changes'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
