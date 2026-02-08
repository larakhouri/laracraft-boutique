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

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

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

    // Check if admin or Lara to redirect to inventory
    let target = '/'
    if (user) {
        if (user.email === 'lara.khouri19@gmail.com') {
            target = '/inventory'
        } else {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()
            if (profile?.role === 'super_admin' || profile?.role === 'staff') {
                target = '/inventory'
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect(target)
    // return { error: '', success: true, message: 'Signed in' } // Unreachable due to redirect
}

export async function signup(prevState: any, formData: FormData) {
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

    // Return success state for the UI to handle (Toast)
    // We don't redirect immediately so the user sees the "Welcome" toast/message?
    // Or we redirect to a dashboard?
    // User request: "When a user clicks 'Create Account', use a Shadcn Toast to say: 'Welcome to the studio!'"
    // This implies we stay on page or redirect with a flag. 
    // Usually signup implies immediate login in Supabase if email confirmation is disabled, 
    // or "Check your email" if enabled.
    // Assuming Email Confirm is ON by default in Supabase, but for this demo maybe we just want message.
    // If we return success, the client component updates.

    return { success: true, message: 'Welcome to the studio! Your artisan profile is ready.', error: '' }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
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
