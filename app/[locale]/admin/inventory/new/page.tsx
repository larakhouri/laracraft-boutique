import NewProductForm from '@/components/studio/NewProductForm'

export default async function NewPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    return (
        <div className="p-8 max-w-2xl mx-auto pt-20">
            <h1 className="font-serif text-3xl mb-8 italic text-[#003D4D]">Create New Piece</h1>
            <NewProductForm locale={locale} />
        </div>
    )
}
