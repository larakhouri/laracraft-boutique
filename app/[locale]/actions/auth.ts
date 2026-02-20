'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().min(2, "Name is required"),
})

import { getLocale } from 'next-intl/server'

// ... existing imports

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const locale = await getLocale() // 👈 Get the current language vault

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // Force clear any simple sessions/cookies content by signing out first
    await supabase.auth.signOut()

    const result = loginSchema.safeParse(data)

    if (!result.success) {
        return { error: 'Invalid email or password format' }
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    const { data: { user } } = await supabase.auth.getUser()

    let target = `/${locale}` // 👈 Default for Users: The Home Page

    if (user) {
        // Fetch profile to check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // 🛡️ Admin & Lara Redirect to Dashboard
        if (user.email === 'lara.khouri19@gmail.com' || profile?.role === 'super_admin' || profile?.role === 'staff') {
            target = `/${locale}/dashboard`
        }
    }

    revalidatePath('/', 'layout')
    redirect(target)
}

export async function signup(prevState: any, formData: FormData) {
    // ... existing signup code ...
    // Note: User didn't ask to change signup redirect specifically, but mentioned "Update signOut and signup (if redirecting)". 
    // The current signup returns a message, not a separate redirect. I will leave it as is unless I see it redirects. 
    // Looking at the file, it returns an object.

    // ... (keeping existing signup logic for now as it doesn't redirect)

    const supabase = await createClient()

    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        full_name: formData.get('full_name') as string,
    }

    const result = signupSchema.safeParse(rawData)

    if (!result.success) {
        return { error: result.error.issues[0].message, success: false, message: '' }
    }

    const { error } = await supabase.auth.signUp({
        email: rawData.email,
        password: rawData.password,
        options: {
            data: {
                full_name: rawData.full_name
            }
        }
    })

    if (error) {
        return { error: error.message, success: false, message: '' }
    }

    return { success: true, message: 'Welcome to the studio! Your artisan profile is ready.', error: '' }
}

export async function signOut() {
    const supabase = await createClient()
    const locale = await getLocale() // Get locale
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect(`/${locale}/login`) // 👈 Stay in the same language
}

export async function revalidateRole() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            throw new Error('No user session')
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profile) {
            // Force update local session data if needed (optional, but good for syncing meta)
            // await supabase.auth.updateUser({ data: { role: profile.role } }) 
            // Supabase session doesn't easily allow arbitrary updates without secure context or trigger.
            // Instead, we just refresh the server token logic by default on next request.
            // But the user asked to "manually refreshes the user's session cookie".
            // `refreshSession` does that.
            await supabase.auth.refreshSession()
            revalidatePath('/', 'layout')
        }
    } catch (error) {
        // Force clear cookies if session is invalid or refresh fails
        console.error('Auth Sync Error:', error)
        if (typeof window === 'undefined') {
            const { cookies } = await import('next/headers')
            const cookieStore = await cookies()
            // Clear known Supabase cookies
            const allCookies = cookieStore.getAll()
            allCookies.forEach(c => {
                if (c.name.startsWith('sb-')) {
                    cookieStore.delete(c.name)
                }
            })
        }
    }
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const locale = await getLocale()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/reset-password`,
    })

    if (error) return { error: error.message }
    return { success: true, message: "A reset link has been sent to your email." }
}
