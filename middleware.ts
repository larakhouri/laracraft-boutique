import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // Our Six Pillars supported languages
    locales: ['en', 'de', 'ar'],
    defaultLocale: 'en',
    // This is the CRITICAL fix: it forces the URL to keep the language prefix
    localePrefix: 'always'
});

export const config = {
    // Match all paths except internal Next.js files and API routes
    matcher: [
        '/',
        '/(de|en|ar)/:path*',
        '/((?!api|_next|_static|_vercel|.*\\..*|\\.well-known).*)'
    ]
};