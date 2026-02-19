'use client'

import { useActionState, useEffect, useState } from 'react'
import { login, signup } from '@/app/[locale]/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

const initialState = {
    error: '',
    success: false,
    message: ''
}

function SignInForm() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <form action={formAction} className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input id="email-signin" name="email" type="email" placeholder="artisan@studio.com" required />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password-signin">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline">Forgot?</Link>
                </div>
                <Input id="password-signin" name="password" type="password" required />
            </div>
            {state?.error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.error}</p>}
            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#2A8B8B] hover:bg-[#237070] text-white"
            >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Sign In
            </Button>
        </form>
    )
}

function SignUpForm() {
    const [state, formAction, isPending] = useActionState(signup, initialState)
    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        if (state?.success) {
            setShowToast(true)
            const timer = setTimeout(() => setShowToast(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [state?.success])

    return (
        <>
            <form action={formAction} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input id="fullname" name="full_name" placeholder="Lara Craft" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" name="email" type="email" placeholder="artisan@studio.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" name="password" type="password" minLength={6} required />
                </div>
                {state?.error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.error}</p>}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#2A8B8B] hover:bg-[#237070] text-white"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Account
                </Button>
            </form>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4"
                    >
                        <div className="bg-white border border-stone-200 shadow-xl rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-serif font-medium text-stone-800">Welcome to the Studio!</h4>
                                    <p className="text-xs text-stone-500">{state.message}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowToast(false)}
                                className="text-stone-400 hover:text-stone-600"
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default function AuthTabs() {
    return (
        <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-stone-100">
                <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:text-[#2A8B8B] font-serif">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-[#2A8B8B] font-serif">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
                <SignInForm />
            </TabsContent>
            <TabsContent value="signup">
                <SignUpForm />
            </TabsContent>
        </Tabs>
    )
}
