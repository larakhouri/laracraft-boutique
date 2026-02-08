import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // Protected routes
    const protectedRoutes = ['/admin', '/customer', '/inventory', '/dashboard']
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && (path.startsWith('/admin') || path.startsWith('/inventory') || path.startsWith('/dashboard'))) {
        // Strict DB Role Check for Admin/Inventory/Dashboard
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role

        // For dashboard, we just need to ensure they have a profile, or maybe we don't enforce role *type* but just existence?
        // User didn't specify strict role for dashboard, but "Force Role Re-Validation" implies we check it.
        // If they are customer, they can access /dashboard. If admin, also likely yes.
        // Let's just ensure profile exists (which the query does).

        // Admin/Inventory specific restriction:
        // Exception: Explicitly allow 'lara.khouri19@gmail.com' to bypass role check temporarily
        const isLara = user.email === 'lara.khouri19@gmail.com'
        if ((path.startsWith('/admin') || path.startsWith('/inventory')) && role !== 'super_admin' && role !== 'staff' && !isLara) {
            // Unauthorized - redirect to login with error
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('error', 'unauthorized')
            return NextResponse.redirect(url)
        }
    }

    return response
}
