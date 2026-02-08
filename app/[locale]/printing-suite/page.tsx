import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Static list of 20 print categories/formats
const PRINT_CATEGORIES = [
    { title: "Premium Canvas", description: "Archival grade canvas stretched over solid wood.", size: "Var" },
    { title: "Acrylic Glass", description: "Crystal clear polished acrylic for depth.", size: "Var" },
    { title: "Brushed Aluminum", description: "Modern, matte metal finish. Industrial look.", size: "Var" },
    { title: "Classic Wood Frame", description: "Sustainably sourced oak frame with matte paper.", size: "50x70" },
    { title: "Gallery Black Frame", description: "Sleek black frame, white mat board.", size: "50x70" },
    { title: "Gallery White Frame", description: "Minimalist white frame, white mat board.", size: "50x70" },
    { title: "Poster Print (Matte)", description: "Heavyweight museum-quality paper.", size: "50x70" },
    { title: "Poster Print (Semi-Gloss)", description: "Vibrant semi-gloss finish.", size: "50x70" },
    { title: "Foam Board", description: "Lightweight and versatile mounting.", size: "Var" },
    { title: "Wood Print", description: "Direct print on natural wood grain.", size: "Var" },
    { title: "Acrylic Block", description: "Freestanding solid acrylic block.", size: "20x20" },
    { title: "Aluminum Dibond", description: "Rigid composite for large formats.", size: "Var" },
    { title: "Fine Art Print", description: "Textured cotton rag paper.", size: "Var" },
    { title: "Metallic Paper", description: "Pearlescent finish for high contrast.", size: "Var" },
    { title: "Canvas Scroll", description: "Canvas with wooden hanger bars.", size: "Var" },
    { title: "Floating Frame", description: "Canvas inside a gap frame.", size: "Var" },
    { title: "Box Frame", description: "Deep set frame for object-like presence.", size: "Var" },
    { title: "Giclée Print", description: "Highest resolution inkjet printing.", size: "Var" },
    { title: "Mounted Print", description: "Paper mounted on rigid backing.", size: "Var" },
    { title: "Eco-Friendly Paper", description: "100% recycled luxury stock.", size: "Var" }
]

export default function PrintingSuitePage() {
    return (
        <div className="min-h-screen bg-[#F8F6F1] px-8 py-16 md:px-24">
            <div className="max-w-4xl mb-16">
                <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-12 uppercase text-[10px] tracking-widest font-bold"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Gallery
                </Link>
                <h2 className="text-sm font-sans tracking-[0.3em] uppercase text-stone-400 mb-4">Material Excellence</h2>
                <h1 className="text-5xl md:text-6xl font-serif italic text-stone-800">The Printing Suite</h1>
                <p className="mt-6 text-stone-500 font-serif text-lg leading-relaxed max-w-2xl">
                    Every artifact is printed to order using museum-grade materials. Explore our curated selection of 20 unique formats designed to preserve your chronicle.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                {PRINT_CATEGORIES.map((category, index) => (
                    <div key={index} className="bg-white border border-stone-200 p-6 flex flex-col justify-between hover:border-[#004d4d] transition-colors group">
                        <div className="mb-4">
                            <div className="w-full aspect-square bg-stone-100 mb-4 relative overflow-hidden">
                                {/* Placeholder for actual mockup */}
                                <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-xs uppercase tracking-widest font-bold bg-stone-50 group-hover:bg-stone-100 transition-colors">
                                    Mockup
                                </div>
                            </div>
                            <h3 className="font-serif text-lg text-stone-800 mb-2">{category.title}</h3>
                            <p className="text-stone-500 text-xs leading-relaxed">{category.description}</p>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-400 border-t border-stone-50 pt-3">
                            Format: {category.size}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
