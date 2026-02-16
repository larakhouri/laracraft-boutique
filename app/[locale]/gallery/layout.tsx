import React from 'react';

export default async function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This wrapper is now clean, allowing the individual pages to control their headers
    return (
        <section className="flex flex-col min-h-screen bg-[#F8F6F1]">
            <div className="flex-1">
                {children}
            </div>
        </section>
    );
}