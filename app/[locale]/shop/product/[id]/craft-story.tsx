'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface CraftStep {
    title: string
    description: string
    image_url: string
}

interface CraftStoryProps {
    process: CraftStep[]
    materials: string[]
}

export default function CraftStory({ process, materials }: CraftStoryProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Dim background effect: starts dimming when component enters, restores when leaving
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const overlayOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 0.6])

    if (!process || process.length === 0) return null

    return (
        <div ref={containerRef} className="relative py-24 min-h-screen">
            {/* Background Dim Overlay */}
            <motion.div
                style={{ opacity: overlayOpacity }}
                className="fixed inset-0 bg-stone-900 pointer-events-none z-0 mix-blend-multiply"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-serif text-primary italic mb-6"
                    >
                        Behind the Craft
                    </motion.h2>

                    {/* Materials Badges */}
                    {materials && materials.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3">
                            {materials.map((mat, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-medium tracking-wide shadow-sm"
                                >
                                    {mat}
                                </motion.span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Sticky Image Section */}
                    <div className="hidden lg:block sticky top-32 h-[600px] rounded-lg overflow-hidden shadow-2xl border border-stone-200 bg-white">
                        {/* 
                    In a real implementation, you'd wire this up to change the image 
                    based on the currently active step (using intersection observer or scroll position).
                    For simplicity in this pivot, we'll show the process image of the first step or a compilation.
                 */}
                        <div className="relative h-full w-full">
                            {process[0]?.image_url ? (
                                <Image
                                    src={process[0].image_url}
                                    alt="Craft Process"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-stone-100 text-stone-400">
                                    <span className="font-serif italic text-xl">The Artisan's Touch</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scrolling Steps */}
                    <div className="space-y-32">
                        {process.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ margin: "-20% 0px -20% 0px" }}
                                transition={{ duration: 0.8 }}
                                className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-stone-100"
                            >
                                {/* Mobile Image (Visible only on small screens) */}
                                <div className="lg:hidden relative h-64 mb-6 rounded-md overflow-hidden bg-stone-100">
                                    {step.image_url && (
                                        <Image
                                            src={step.image_url}
                                            alt={step.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>

                                <span className="text-primary font-serif italic text-lg mb-2 block">Step 0{index + 1}</span>
                                <h3 className="text-2xl font-serif text-foreground mb-4">{step.title}</h3>
                                <p className="text-stone-600 leading-relaxed text-lg">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
