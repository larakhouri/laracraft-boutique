'use client'
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleSwitch = (newLocale: string) => {
        startTransition(() => {
            // router.replace from next-intl automatically handles the locale prefixing
            router.replace(pathname, { locale: newLocale });
        });
    };

    return (
        <div className={`relative flex items-center bg-stone-100 rounded-full p-1 w-[180px] h-[40px] border border-stone-200 ${isPending ? 'opacity-50' : ''}`}>
            <div
                className="absolute h-[32px] w-[56px] bg-[#003D4D] rounded-full shadow-lg transition-all duration-300 ease-in-out"
                style={{
                    left: locale === 'en' ? '4px' : locale === 'de' ? '62px' : '120px'
                }}
            />
            {['en', 'de', 'ar'].map((l) => (
                <button
                    key={l}
                    onClick={() => handleSwitch(l)}
                    className={`relative z-10 w-full text-xs font-bold transition-colors duration-300 ${locale === l ? 'text-white' : 'text-stone-400'}`}
                >
                    {l.toUpperCase()}
                </button>
            ))}
        </div>
    );
}