'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateGlobalPreferences(formData: FormData) {
    const currency = formData.get('currency') as string
    const country = formData.get('country') as string

    const cookieStore = await cookies()

    // Store for 1 year
    if (currency) {
        cookieStore.set('artisan_currency', currency, { maxAge: 60 * 60 * 24 * 365, path: '/' })
    }
    if (country) {
        cookieStore.set('artisan_country', country, { maxAge: 60 * 60 * 24 * 365, path: '/' })
    }

    // Refresh the entire layout to apply the new currency/country instantly
    revalidatePath('/', 'layout')

    return { success: true }
}
