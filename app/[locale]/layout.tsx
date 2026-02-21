import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, Amiri } from "next/font/google";
import "@/app/globals.css";
import Navbar from "../../components/Navbar";
import { SiteFooter } from "@/components/site-footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import React from 'react';
// 🟢 STEP 1: Import the floating button component
import FloatingPrintGuide from "@/components/FloatingPrintGuide";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif"
});
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri"
});

export const metadata: Metadata = {
  title: "Lara Craft Gifts | Bespoke Artisan Goods",
  description: "Discover handcrafted treasures and follow the journey of your bespoke commissions.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  }
};

export const viewport: Viewport = {
  themeColor: '#fdfcf8',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const fontVariable = locale === 'ar' ? amiri.variable : `${inter.variable} ${cormorant.variable}`;
  const fontFamily = locale === 'ar' ? 'font-amiri' : 'font-sans';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${fontVariable} ${fontFamily} antialiased bg-[#fdfcf8] text-foreground relative min-h-screen flex flex-col`}
        style={{
          forcedColorAdjust: 'none',
          colorScheme: 'light'
        }}
      >
        <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[10] mix-blend-multiply bg-[url('/noise.svg')]"></div>

        <NextIntlClientProvider messages={messages}>
          <header className="relative z-[100]">
            <Navbar locale={locale} user={user} profile={profile} />
          </header>

          <main className="flex-1 relative z-0">
            {children}
          </main>

          {/* 🟢 STEP 2: Restore the Floating Print Guide here */}
          <FloatingPrintGuide />

          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}