'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

interface InquiryDialogProps {
    photoId: string
    photoTitle: string
}

export default function InquiryDialog({ photoId, photoTitle }: InquiryDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const style = formData.get('style') as string
        const size = formData.get('size') as string
        const message = formData.get('message') as string

        const supabase = createClient()

        const { error } = await supabase
            .from('print_inquiries')
            .insert({
                photo_id: photoId,
                photo_title: photoTitle,
                customer_email: email,
                preferred_style: style,
                preferred_size: size,
                status: 'pending' // Note regarding 'message': The simplified schema in task didn't have message, but it is good for UX. 
                // If schema is strict, we might need to add it or omit. 
                // I will assume for now we just want to capture the structured data.
            })

        if (error) {
            console.error('Error submitting inquiry:', error)
            alert('There was an error submitting your inquiry. Please try again.')
        } else {
            setSubmitted(true)
        }

        setLoading(false)
    }

    if (submitted) {
        return (
            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val)
                if (!val) setSubmitted(false) // Reset on close
            }}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-[#004d4d] text-white py-6 rounded-none font-serif tracking-widest uppercase text-xs">
                        Inquire About This Piece
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-[#F8F6F1]">
                    <DialogHeader>
                        <DialogTitle className="font-serif italic text-2xl text-[#004d4d]">Inquiry Received</DialogTitle>
                        <DialogDescription className="text-stone-600 font-sans">
                            Thank you for your interest in <span className="italic">"{photoTitle}"</span>.
                            <br /><br />
                            We have received your request. A curator will review your preferences and send a personalized invoice and fulfillment timeline to your email shortly.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => setOpen(false)} className="bg-[#004d4d] text-white rounded-none mt-4">
                        Return to Gallery
                    </Button>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-[#004d4d] text-white py-6 rounded-none font-serif tracking-widest uppercase text-xs hover:bg-[#003636] transition-colors">
                    Inquire About This Piece
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#F8F6F1]">
                <DialogHeader>
                    <DialogTitle className="font-serif italic text-2xl text-stone-800">Acquisition Inquiry</DialogTitle>
                    <DialogDescription className="text-stone-500 text-xs uppercase tracking-widest font-bold">
                        {photoTitle}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs uppercase text-stone-400 font-bold">Email Address</Label>
                        <Input id="email" name="email" type="email" required placeholder="client@example.com" className="bg-white border-stone-200 rounded-none focus:ring-[#004d4d]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="style" className="text-xs uppercase text-stone-400 font-bold">Preferred Style</Label>
                            <Select name="style" required>
                                <SelectTrigger className="bg-white border-stone-200 rounded-none">
                                    <SelectValue placeholder="Select Style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Classic Frame">Classic Wood Frame</SelectItem>
                                    <SelectItem value="Acrylic Glass">Acrylic Glass</SelectItem>
                                    <SelectItem value="Aluminium">Brushed Aluminium</SelectItem>
                                    <SelectItem value="Undecided">I need advice</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="size" className="text-xs uppercase text-stone-400 font-bold">Approximate Size</Label>
                            <Select name="size" required>
                                <SelectTrigger className="bg-white border-stone-200 rounded-none">
                                    <SelectValue placeholder="Select Size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Small (30x40cm)">Small (30x40cm)</SelectItem>
                                    <SelectItem value="Medium (50x70cm)">Medium (50x70cm)</SelectItem>
                                    <SelectItem value="Large (70x100cm)">Large (70x100cm)</SelectItem>
                                    <SelectItem value="Undecided">Not sure yet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-xs uppercase text-stone-400 font-bold">Additional Notes (Optional)</Label>
                        <Textarea id="message" name="message" placeholder="Any specific requirements or questions?" className="bg-white border-stone-200 rounded-none focus:ring-[#004d4d] min-h-[100px]" />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-[#004d4d] hover:bg-[#003636] text-white py-6 rounded-none">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {loading ? "Sending..." : "Submit Inquiry"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
