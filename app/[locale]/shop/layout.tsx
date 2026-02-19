import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { UserNav } from '@/components/user-nav'

import { getTranslations } from 'next-intl/server'

export default async function ShopLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    return (
        <>
            {children}
        </>
    )
}