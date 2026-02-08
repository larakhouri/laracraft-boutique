import { Suspense } from 'react';
import ArtisanGrid from './ArtisanGrid';

export default function PrintGuidePage() {
    return (
        <main className="min-h-screen bg-[#FBFBF9] pb-32">
            {/* 🟢 25vh LUXURY HEADER */}
            <header className="h-[25vh] min-h-[220px] flex flex-col justify-center items-center text-center bg-white border-b border-stone-100">
                <h1 className="font-serif italic text-6xl text-[#003D4D] mb-4 tracking-tight">
                    Artisan Formats
                </h1>
                <p className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">
                    Visualization of the Physical Narrative
                </p>
            </header>

            {/* 🟢 SUSPENSE WRAPPER FOR LOADING STATE */}
            <Suspense fallback={
                <div className="w-full py-48 text-center">
                    <p className="font-serif italic text-2xl text-stone-300 animate-pulse">
                        Loading Artisan Examples...
                    </p>
                </div>
            }>
                <ArtisanGrid />
            </Suspense>
        </main>
    );
}
