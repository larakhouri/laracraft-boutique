'use client'

import { useActionState } from 'react'
import { submitLead } from '@/app/actions/leads'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquareText } from 'lucide-react'

const initialState = {
    success: false,
    message: '',
    error: '',
    fieldErrors: {} as Record<string, string[]>,
}

export default function InquiryForm({ productId }: { productId: string }) {
    const [state, action, isPending] = useActionState(submitLead, initialState)

    return (
        <form action={action} className="space-y-6">
            <input type="hidden" name="productId" value={productId} />

            <div className="space-y-2">
                <Input
                    name="email"
                    type="email"
                    placeholder="Your Email Address"
                    required
                    className="bg-[#faf9f7] border-[#e8e6e1] focus:ring-primary h-12 text-lg font-serif"
                />
            </div>

            <div className="space-y-2">
                <Textarea
                    name="message"
                    placeholder="Tell us about your custom needs..."
                    required
                    className="bg-[#faf9f7] border-[#e8e6e1] focus:ring-primary min-h-[120px] text-lg font-serif"
                />
            </div>

            {state?.error && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded-sm">{state.error}</p>
            )}

            {state?.message && (
                <p className="text-[#2A8B8B] text-sm bg-teal-50 p-2 rounded-sm border border-teal-100">{state.message}</p>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#2A8B8B] hover:bg-[#237a7a] text-white h-14 text-xl font-serif italic tracking-wide rounded-sm transition-all shadow-md hover:shadow-lg"
            >
                {isPending ? 'Sending...' : 'Request Consultation'}
                {!isPending && <MessageSquareText className="w-5 h-5 ml-3" />}
            </Button>
        </form>
    )
}
