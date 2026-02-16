import { useTranslations } from 'next-intl';

export default function ImpressumPage() {
    const t = useTranslations('Footer');
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl bg-[#fdfcf8] text-[#004d4d]">
            <h1 className="text-3xl font-serif mb-6">Impressum</h1>
            <div className="space-y-4 font-sans text-sm">
                <p>LaraCraft Gifts</p>
                <p>Lara Khouri</p>
                <p>Cologne, Germany</p>
                <p>Contact: storelaracraft@gmail.com</p>
                <p className="mt-8 text-xs text-stone-500">Angaben gemäß § 5 TMG</p>
            </div>
        </div>
    );
}
