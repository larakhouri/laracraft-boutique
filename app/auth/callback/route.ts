import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        // 🟢 FIX: Exchange code for session (This logs the user IN)
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Redirect to the intended page (or home)
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // 🔴 ERROR: If code exchange fails, return to login with a message
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
