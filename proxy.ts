import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
    locales: ['en', 'de', 'ar'],
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});

export async function proxy(request: NextRequest) {
    // 1. Ignore API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // 2. Run Supabase auth check
    const supabaseResponse = await updateSession(request);

    // 3. Run i18n middleware (this now handles /admin/studio correctly)
    const intlResponse = intlMiddleware(request);

    // 4. Merge headers/cookies to keep session alive
    supabaseResponse.headers.forEach((value, key) => {
        intlResponse.headers.set(key, value);
    });
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value);
    });

    return intlResponse;
}

export const config = {
    // 🟢 FIXED: Removed 'admin' from the exclusion list so the middleware can process admin routes
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}