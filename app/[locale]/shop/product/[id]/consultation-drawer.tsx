'use client'

import * as React from 'react'
import { useMediaQuery } from '@/hooks/use-media-query' // Logic to detect desktop vs mobile
import { useActionState } from 'react'
import { submitInquiry } from '@/app/(shop)/product/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { MessageSquareText, Sparkles, Send } from 'lucide-react'

// Simple hook if not available in project yet
function useIsDesktop() {
    const [isDesktop, setIsDesktop] = React.useState(false)

    React.useEffect(() => {
        const media = window.matchMedia('(min-width: 768px)')
        const listener = () => setIsDesktop(media.matches)
        setIsDesktop(media.matches)
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [])

    return isDesktop
}

const initialState = {
    success: false,
    message: '',
    error: '',
    fieldErrors: {} as Record<string, string[]>,
}

function ConsultationForm({ productId, className }: { productId: string, className?: string }) {
    const [state, action, isPending] = useActionState(submitInquiry, initialState)

    return (
        <form action={action} className={`space-y-6 ${className}`}>
            <input type="hidden" name="productId" value={productId} />

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-stone-600">Email Address</label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="bg-white border-stone-200 focus:ring-primary focus:border-primary h-12"
                />
                {state?.fieldErrors?.email && <p className="text-red-500 text-xs">{state.fieldErrors.email[0]}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-stone-600">Customization Request</label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="I love the dimensions, but could we do a darker finish?"
                    required
                    className="bg-white border-stone-200 focus:ring-primary focus:border-primary min-h-[150px] resize-none"
                />
                {state?.fieldErrors?.message && <p className="text-red-500 text-xs">{state.fieldErrors.message[0]}</p>}
            </div>

            {state?.error && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded-sm">{state.error}</p>
            )}

            {state?.message && (
                <div className="bg-teal-50 border border-teal-100 p-4 rounded-sm flex items-start animate-in fade-in duration-500">
                    <Sparkles className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <p className="text-primary text-sm font-medium">{state.message}</p>
                </div>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#2A8B8B] hover:bg-[#237a7a] text-white h-12 text-lg font-serif italic tracking-wide rounded-sm mt-4 shadow-sm"
            >
                {isPending ? 'Sending...' : 'Send Request'}
                {!isPending && <Send className="w-4 h-4 ml-2" />}
            </Button>
        </form>
    )
}

export default function ConsultationDrawer({ productId }: { productId: string }) {
    const isDesktop = useIsDesktop()
    const [open, setOpen] = React.useState(false)

    const TriggerButton = (
        <Button className="w-full bg-[#2A8B8B] hover:bg-[#237a7a] text-white h-14 text-xl font-serif italic tracking-wide rounded-sm transition-all shadow-md hover:shadow-lg">
            Request Customization
            <MessageSquareText className="w-5 h-5 ml-3" />
        </Button>
    )

    if (isDesktop) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    {TriggerButton}
                </SheetTrigger>
                <SheetContent className="sm:max-w-md bg-[#F8F6F1] border-l border-stone-200">
                    <SheetHeader className="mb-8">
                        <SheetTitle className="font-serif text-3xl text-primary italic">Begin Consultation</SheetTitle>
                        <SheetDescription className="text-stone-500">
                            Submit your customization details below. Our artisan will review and contact you within 24 hours.
                        </SheetDescription>
                    </SheetHeader>
                    <ConsultationForm productId={productId} />
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {TriggerButton}
            </DrawerTrigger>
            <DrawerContent className="bg-[#F8F6F1] border-stone-200">
                <DrawerHeader className="text-left">
                    <DrawerTitle className="font-serif text-2xl text-primary italic">Begin Consultation</DrawerTitle>
                    <DrawerDescription className="text-stone-500">
                        Submit your customization details below.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-8">
                    <ConsultationForm productId={productId} />
                </div>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline" className="border-stone-300 text-stone-500">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
