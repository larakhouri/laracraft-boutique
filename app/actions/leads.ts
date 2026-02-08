'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const leadSchema = z.object({
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Please share a bit more detail about your interest.'),
    productId: z.string().uuid(),
})

export async function submitLead(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Validate
    const rawData = {
        email: formData.get('email'),
        message: formData.get('message'),
        productId: formData.get('productId'),
    }

    const validatedFields = leadSchema.safeParse(rawData)
    if (!validatedFields.success) {
        return {
            success: false,
            message: '',
            error: 'Please check your inputs.',
            fieldErrors: validatedFields.error.flatten().fieldErrors
        }
    }

    // 2. Insert to DB
    const { error } = await supabase
        .from('leads')
        .insert({
            email: validatedFields.data.email,
            message: validatedFields.data.message,
            product_id: validatedFields.data.productId,
        })

    if (error) {
        console.error('Lead Error:', error)
        return { success: false, message: '', error: 'Failed to submit inquiry. Please try again.', fieldErrors: {} }
    }

    return { success: true, message: 'Inquiry sent! We will craft a response shortly.', error: '', fieldErrors: {} }
}
