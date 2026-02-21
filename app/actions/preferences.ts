'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateGlobalPreferences(formData: FormData) {
    const currency = formData.get('currency') as string
    const country = formData.get('country') as string

    const cookieStore = await cookies()

    // Store preferences for 1 year
    if (currency) {
        cookieStore.set('artisan_currency', currency, { maxAge: 31536000, path: '/' })
    }
    if (country) {
        cookieStore.set('artisan_country', country, { maxAge: 31536000, path: '/' })
    }

    // Refresh the site to apply new settings
    revalidatePath('/', 'layout')
    return { success: true }
}