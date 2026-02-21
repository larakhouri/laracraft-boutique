'use client'
import React, { useState } from 'react'
import { InlineWidget } from "react-calendly"
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

export default function BespokeConsultation({ locale }: { locale: string }) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const payload = {
            budget: formData.get('budget'),
            gift_type: formData.get('gift_type'),
            deadline: formData.get('deadline'),
            requested_materials: formData.getAll('materials'), // 🟢 MUST match the SQL column name
            locale: locale
        };

        // 🟢 Insert into Supabase (Make sure your 'bespoke_requests' table exists)
        const { error } = await supabase.from('bespoke_requests').insert([payload]);

        if (error) {
            console.error("Inquiry Error:", error.message);
            alert("Submission failed. Please try again.");
        } else {
            setSubmitted(true);
        }
        setLoading(false);
    };

    if (submitted) {

        return (

            <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">

                <div className="text-center mb-10">

                    <h2 className="font-serif italic text-3xl text-[#003D4D]">Brief Received.</h2>

                    <p className="text-stone-500 mt-2">Please select a moment for our artisan consultation below.</p>

                </div>

                {/* 🔗 REPLACE WITH YOUR ACTUAL CALENDLY URL */}

                <InlineWidget url="https://calendly.com/storelaracraft/30min" />

            </div>

        );

    }



    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-12 shadow-sm border border-stone-100 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Budget Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Estimated Budget</label>
                    <select name="budget" required className="border-b border-stone-200 py-3 outline-none focus:border-[#2A8B8B] bg-transparent font-serif italic text-lg cursor-pointer">
                        <option value="500-1500">500€ — 1.500€</option>
                        <option value="1500-5000">1.500€ — 5.000€</option>
                        <option value="5000+">5.000€ +</option>
                    </select>
                </div>

                {/* Deadline */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Required Deadline</label>
                    <input type="date" name="deadline" required className="border-b border-stone-200 py-3 outline-none focus:border-[#2A8B8B] bg-transparent text-sm cursor-pointer" />
                </div>

                {/* Gift Type */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Occasion / Gift Type</label>
                    <input name="gift_type" required placeholder="e.g. Anniversary, Corporate Event" className="border-b border-stone-200 py-3 outline-none focus:border-[#2A8B8B] bg-transparent text-lg font-serif italic" />
                </div>
            </div>

            {/* Materials Selection */}
            <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Requested Materials</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {['Fine Art Paper', 'Canvas', 'Acrylic', 'Metal', 'Bespoke Framing'].map((mat) => (
                        <label key={mat} className="flex items-center gap-3 p-4 border border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors group">
                            <input type="checkbox" name="materials" value={mat} className="accent-[#2A8B8B]" />
                            <span className="text-[11px] uppercase tracking-tighter text-stone-600 group-hover:text-stone-900">{mat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#003D4D] hover:bg-[#002b36] text-white py-10 rounded-none uppercase text-[10px] tracking-[0.4em] font-bold">
                {loading ? 'Processing Brief...' : 'Submit Brief & Open Calendar'}
            </Button>
        </form>
    );
}