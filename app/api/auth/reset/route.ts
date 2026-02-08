import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const cookieStore = await cookies()

    // 1. Supabase SignOut (clears its own sessions)
    await supabase.auth.signOut()

    // 2. Nuclear Option: Clear ALL cookies
    const allCookies = cookieStore.getAll()
    allCookies.forEach((cookie) => {
        cookieStore.delete(cookie.name)
    })

    return NextResponse.json({
        message: 'Session nuked. All cookies cleared.',
        success: true
    })
}
