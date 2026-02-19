import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Amiri } from "next/font/google";
import "@/app/globals.css";
import Navbar from "../../components/Navbar";
import { SiteFooter } from "@/components/site-footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';

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
    icon: '/logo.png', // 👈 Points to your official brand asset
    shortcut: '/logo.png',
    apple: '/logo.png',
  }
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
      <body className={`${fontVariable} ${fontFamily} antialiased bg-background text-foreground relative min-h-screen flex flex-col`}>
        {/* Film Grain */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[9999] mix-blend-multiply bg-[url('/noise.svg')]"></div>

        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} user={user} profile={profile} />
          <main className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}