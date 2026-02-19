import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin, pathname } = new URL(request.url)
    const code = searchParams.get('code')
    // Get the current locale from the URL or headers
    // Note: If the callback URL is just /auth/callback, this might default to 'en'.
    // ideally we should pass it in state or cookie, but for now we follow the user's snippet logic
    // or try to parse it if the route was /en/auth/callback (which it isn't usually).
    // User suggestion: `requestUrl.pathname.split('/')[1] || 'en'`
    const locale = pathname.split('/')[1] || 'en'

    if (code) {
        const supabase = await createClient()
        // 🟢 FIX: Exchange code for session (This logs the user IN)
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Redirect to the localized root or dashboard
            return NextResponse.redirect(`${origin}/${locale}`)
        }
    }

    // 🔴 ERROR: If code exchange fails, return to login with a message
    return NextResponse.redirect(`${origin}/${locale}/login?error=auth_failed`)
}
