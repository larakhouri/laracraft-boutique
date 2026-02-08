'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const consultationSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    message: z.string().min(10, 'Please provide more details about your customization request'),
    productId: z.string().uuid(),
})

export async function submitInquiry(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        email: formData.get('email'),
        message: formData.get('message'),
        productId: formData.get('productId'),
    }

    const validatedFields = consultationSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            success: false,
            message: '',
            error: 'Please check your inputs.',
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { error } = await supabase
        .from('consultations')
        .insert({
            email: validatedFields.data.email,
            message: validatedFields.data.message,
            product_id: validatedFields.data.productId,
        })

    if (error) {
        console.error('Consultation Error:', error)
        return { success: false, message: '', error: 'Failed to send request. Please try again.', fieldErrors: {} }
    }

    return { success: true, message: 'Inquiry received. We will be in touch shortly.', error: '', fieldErrors: {} }
}
