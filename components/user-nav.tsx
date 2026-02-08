'use client'

import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

interface UserNavProps {
    user: User | null;
    profile: any;
    className?: string;
}

export function UserNav({ user, profile, className }: UserNavProps) {
    const params = useParams();
    const router = useRouter();

    // Safely create the client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const locale = params?.locale || 'en';
    const [isOpen, setIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);

            // 1. Attempt to sign out from Supabase
            await supabase.auth.signOut();

            // 2. Force a hard refresh to clear all cache and server state
            // This is more reliable than router.push for logout
            window.location.href = `/${locale}`;

        } catch (error) {
            console.error("Logout error:", error);
            // Even if it fails, force reload to reset the UI
            window.location.reload();
        }
    };

    // If NOT logged in, show "Sign In"
    if (!user) {
        return (
            <Link
                href={`/${locale}/login`}
                className={cn("text-[10px] font-bold tracking-widest uppercase hover:text-[#004d4d] transition-colors", className)}
            >
                Sign In
            </Link>
        );
    }

    // If LOGGED IN, show Profile Pill
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn("flex items-center gap-2 outline-none", className)}
            >
                <span className="text-[11px] font-serif font-medium tracking-wide">
                    {profile?.full_name || 'Artisan'}
                </span>
                {/* Green Dot = Active Session */}
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-4 w-48 bg-white border border-stone-100 shadow-xl rounded-sm py-2 z-20 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <Link
                            href={`/${locale}/dashboard`}
                            className="px-4 py-3 text-[10px] uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-colors text-left"
                            onClick={() => setIsOpen(false)}
                        >
                            Studio Dashboard
                        </Link>

                        <button
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest text-red-800 hover:bg-red-50 transition-colors border-t border-stone-50"
                        >
                            {isSigningOut ? "Signing out..." : "Sign Out"}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}