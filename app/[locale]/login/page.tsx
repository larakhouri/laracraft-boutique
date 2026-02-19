import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AuthTabs from '@/components/auth/login-forms'

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect(`/${locale}/dashboard`) // Go to vault if already logged in
    }

    return (
        <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-stone-100 bg-white">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="font-serif italic text-3xl text-stone-800">Lara Craft</CardTitle>
                    <CardDescription className="text-stone-500 tracking-wide uppercase text-xs">
                        Artisan Client Portal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthTabs />
                </CardContent>
            </Card>
        </div>
    )
}
