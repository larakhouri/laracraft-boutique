import createMiddleware from 'next-intl/middleware';

// 🛡️ Next.js 16 Proxy Implementation
const handleI18nRouting = createMiddleware({
    locales: ['en', 'de', 'ar'],
    defaultLocale: 'en',
    localePrefix: 'always'
});

// Export as default proxy function
export default function proxy(request: any) {
    return handleI18nRouting(request);
}

export const config = {
    // Match all paths except internal Next.js/static files
    matcher: [
        '/',
        '/(de|en|ar)/:path*',
        '/((?!api|_next|_static|_vercel|.*\\..*|\\.well-known).*)'
    ]
};