import { getTranslations } from 'next-intl/server';
import BespokeConsultation from '@/components/bespoke/BespokeConsultation';

export default async function BespokePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // 🟢 This works because of your i18n/request.ts setup
    const t = await getTranslations('Bespoke');

    return (
        <main className="min-h-screen w-full bg-[#F8F6F1]">
            <div className="w-full bg-[#003D4D] py-24 px-12 border-b border-[#002b36]">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="font-serif text-5xl md:text-7xl text-white italic uppercase tracking-tighter">
                        {t('title')}
                    </h1>
                    <div className="h-px w-24 bg-[#C5A059] mx-auto" />
                    <p className="text-stone-400 text-[10px] uppercase tracking-[0.5em] font-bold">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            <section className="py-20 px-6">
                <BespokeConsultation locale={locale} />
            </section>
        </main>
    );
}