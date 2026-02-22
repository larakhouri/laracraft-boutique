import { Camera } from 'lucide-react'
import { Link } from '@/i18n/routing'

export const GalleryPreview = () => {
    // Hardcoded paths to your 6 project files
    const images = [
        '/images/gallery/photo1.jpg',
        '/images/gallery/photo2.jpg',
        '/images/gallery/photo3.jpg',
        '/images/gallery/photo4.jpg',
        '/images/gallery/photo5.jpg',
        '/images/gallery/photo6.jpg',
    ];

    return (
        <Link href="/gallery" className="md:col-span-7 group relative aspect-[16/10] overflow-hidden bg-[#0A0A0A] border border-stone-800 shadow-2xl">
            {images.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt={`Gallery Artifact ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover grayscale opacity-0 transition-opacity duration-[3000ms] ease-in-out 
            group-hover:grayscale-0 group-hover:scale-110 
            animate-gallery-sequence`}
                    style={{
                        // This spreads 6 images across a 24-second loop (4s each)
                        animationDelay: `${index * 4}s`,
                        zIndex: images.length - index
                    }}
                />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex flex-col items-center justify-center text-center px-6 z-20">
                <Camera className="w-8 h-8 mb-6 text-stone-400 group-hover:text-white transition-colors duration-500" />
                <h3 className="text-4xl font-serif italic text-white mb-4 tracking-tighter">The Lens Gallery</h3>
                <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 max-w-xs leading-loose opacity-0 group-hover:opacity-100 transition-all duration-700">
                    A visual archive of the Antigravity Project.
                </p>
            </div>
        </Link>
    );
};