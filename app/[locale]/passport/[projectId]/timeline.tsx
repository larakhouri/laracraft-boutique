'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Hammer, Sparkles } from 'lucide-react'

interface TimelineUpdate {
    date: string
    note: string
    image_url: string
}

interface PassportTimelineProps {
    updates: TimelineUpdate[]
}

export default function PassportTimeline({ updates }: PassportTimelineProps) {
    if (updates.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 flex flex-col items-center justify-center p-8 bg-white border border-stone-100 shadow-sm rounded-sm"
            >
                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-serif italic text-primary mb-2">Starting the Journey</h3>
                <p className="text-stone-500 font-sans max-w-md">
                    Our artisan is preparing your materials. Your personal timeline will appear here soon.
                </p>
            </motion.div>
        )
    }

    return (
        <div className="relative py-12">
            {/* Center Vertical Line (Hidden on mobile, visible on lg) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-stone-300 transform -translate-x-1/2 border-l border-dashed border-stone-300 h-full z-0"></div>

            {/* Mobile Left Line */}
            <div className="lg:hidden absolute left-8 top-0 bottom-0 w-px bg-stone-300 border-l border-dashed border-stone-300 h-full z-0"></div>

            <div className="space-y-24">
                {updates.map((update, index) => {
                    // Alternating Layout for Desktop
                    const isEven = index % 2 === 0

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className={`relative flex flex-col lg:flex-row items-center justify-between ${isEven ? '' : 'lg:flex-row-reverse'}`}
                        >
                            {/* Timestamp Node (Center) */}
                            <div className="absolute left-8 lg:left-1/2 transform lg:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-[#fcf8f3] z-10 shadow-sm top-0 lg:top-8"></div>

                            {/* Content Card */}
                            <div className={`w-full lg:w-5/12 pl-24 lg:pl-0 ${isEven ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:text-left'}`}>
                                <div className="mb-4">
                                    <span className="text-secondary-foreground/60 text-xs font-sans font-medium tracking-widest uppercase">
                                        {new Date(update.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className={`relative p-4 bg-white shadow-xl rotate-1 transform transition-transform hover:rotate-0 duration-500 max-w-sm mx-auto ${isEven ? 'lg:ml-auto lg:mr-0' : 'lg:mr-auto lg:ml-0'}`}>
                                    {/* Polaroid Style Border */}
                                    {update.image_url ? (
                                        <div className="bg-white pb-12 pt-2 px-2 shadow-sm border border-stone-100">
                                            <div className="relative aspect-square w-full overflow-hidden bg-stone-200 grayscale-[20%] hover:grayscale-0 transition-all duration-700">
                                                <Image src={update.image_url} alt="Progress" fill className="object-cover" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center bg-stone-100 text-stone-400 font-mono text-sm">
                                            [No Image Captured]
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Note Section (Opposite Side) */}
                            <div className={`w-full lg:w-5/12 pl-24 lg:pl-0 mt-8 lg:mt-0 px-4 ${isEven ? 'lg:pl-12 lg:text-left' : 'lg:pr-12 lg:text-right'}`}>
                                <h4 className="font-mono text-lg text-primary mb-4 flex items-center gap-2 justify-start lg:justify-start">
                                    <Hammer className="w-4 h-4" />
                                    Artisan Note
                                </h4>
                                <p className="font-mono text-stone-600 leading-relaxed text-sm md:text-base border-l-2 lg:border-l-0 lg:border-t-0 border-stone-200 pl-4 lg:pl-0">
                                    {update.note}
                                </p>
                            </div>

                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
