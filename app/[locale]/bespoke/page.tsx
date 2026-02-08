'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function BespokePage() {
    const tDiscovery = useTranslations('Discovery');
    const supabase = createClient()
    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const description = formData.get('description') as string
        const budget = formData.get('budget') as string

        try {
            const { error } = await supabase
                .from('inquiries')
                .insert({
                    name,
                    email,
                    description,
                    budget
                })

            if (error) throw error

            setIsSuccess(true)
        } catch (error) {
            console.error('Submission error:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setIsPending(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#fcf8f3] flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-stone-200 shadow-lg bg-white">
                    <CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-serif text-stone-800">Request Received</h2>
                        <p className="text-stone-500">
                            Thank you for sharing your vision. I will review your request and get back to you shortly to discuss bringing it to life.
                        </p>
                        <Button
                            className="bg-[#2A8B8B] hover:bg-[#237070] text-white mt-6"
                            onClick={() => window.location.href = '/'}
                        >
                            Return Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fdfcf8] pb-24">
            {/* Unified Bespoke Header */}
            <div className="w-full pt-32 pb-16 flex flex-col items-center">
                <Sparkles className="w-8 h-8 text-[#004d4d]/60 mb-6" strokeWidth={1.5} />
                <h1 className="font-serif text-5xl text-stone-900 mb-4 tracking-tight">Bespoke Commissions</h1>
                <p className="font-serif italic text-stone-500 text-lg tracking-wide text-center max-w-xl mx-auto px-4">
                    {tDiscovery('bespoke_desc')}
                </p>
            </div>

            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-12 space-y-4">
                    {/* Personalization Journey */}
                    <div className="py-8 border-t border-b border-stone-100 my-8">
                        <h3 className="font-serif text-2xl text-stone-800 mb-4 italic">The Personalization Journey</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-stone-500 text-left max-w-4xl mx-auto">
                            <div className="space-y-2">
                                <span className="text-[var(--color-primary)] font-bold block">01. Vision</span>
                                <p>Share your story and inspiration through our intake form.</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[var(--color-primary)] font-bold block">02. Design</span>
                                <p>We collaborate on sketches and select materials (gold, preserved flora).</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[var(--color-primary)] font-bold block">03. Creation</span>
                                <p>Your artifact is handcrafted in the studio and documented.</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <Button
                                variant="outline"
                                className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white uppercase tracking-widest text-xs"
                                onClick={() => window.open('https://calendly.com', '_blank')}
                            >
                                Schedule Consultation
                            </Button>
                        </div>
                    </div>
                </div>

                <Card className="bg-white border-stone-200 shadow-md">
                    <CardHeader className="border-b border-stone-100 pb-8">
                        <CardTitle className="font-serif text-2xl text-stone-800">Intake Form</CardTitle>
                        <CardDescription>Please provide as much detail as possible about your idea.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-stone-600">Your Name</Label>
                                    <Input id="name" name="name" required className="bg-[#fcfaf8] border-stone-200 focus:ring-[#2A8B8B]" placeholder="Jane Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-stone-600">Email Address</Label>
                                    <Input id="email" name="email" type="email" required className="bg-[#fcfaf8] border-stone-200 focus:ring-[#2A8B8B]" placeholder="jane@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-stone-600">Vision & Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    required
                                    className="min-h-[150px] bg-[#fcfaf8] border-stone-200 focus:ring-[#2A8B8B]"
                                    placeholder="Describe the flowers, colors, or specific design elements you have in mind..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="budget" className="text-stone-600">Approximate Budget</Label>
                                <Input id="budget" name="budget" className="bg-[#fcfaf8] border-stone-200 focus:ring-[#2A8B8B]" placeholder="e.g. $200 - $400" />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-12 text-lg bg-[#2A8B8B] hover:bg-[#237070] text-white"
                                >
                                    {isPending ? 'Sending Request...' : 'Submit Inquiry'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
