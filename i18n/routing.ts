import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'de', 'ar'],

    // Used when no locale matches
    defaultLocale: 'en'
});

// Use these new navigation utilities instead of createSharedPathnamesNavigation
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);