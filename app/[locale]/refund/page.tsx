'use client'
import React from 'react'
import { ShieldAlert } from 'lucide-react'

export default function RefundPage() {
    return (
        <main className="min-h-screen w-full bg-[#fdfcf8] px-6 md:px-32 py-24 text-[#004d4d]">
            <div className="max-w-3xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-[#004d4d]/5 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8 text-[#004d4d] stroke-[1.5]" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl tracking-tight">
                        Return & Refund Policy
                    </h1>
                    <p className="font-serif italic text-lg opacity-60">
                        Please read carefully before ordering.
                    </p>
                </div>

                {/* Legal Text Content */}
                <div className="space-y-8 font-sans leading-relaxed text-sm md:text-base opacity-90">

                    <section>
                        <h2 className="font-serif text-2xl mb-2">1. General Return Policy</h2>
                        <p>
                            We are a small, family-owned business based in Germany specializing in handmade and personalized items. Due to the nature of our work, our return policy is stricter than mass-market retailers.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl mb-2">2. Custom & Personalized Items (No Returns)</h2>
                        <p className="mb-4">
                            According to <strong>§ 312g Para. 2 No. 1 BGB (German Civil Code)</strong>, the right of withdrawal (Widerrufsrecht) does NOT apply to contracts for the delivery of goods that are not prefabricated and for the manufacture of which an individual selection or determination by the consumer is decisive or which are clearly tailored to the personal needs of the consumer.
                        </p>
                        <p>Therefore, we <strong>CANNOT accept returns, exchanges, or cancellations</strong> for:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Items personalized with names, dates, or specific text.</li>
                            <li>Items made to specific custom measurements or non-standard colors requested by you.</li>
                            <li>Digital downloads once the file has been sent/downloaded.</li>
                        </ul>
                        <p className="mt-4 italic opacity-80">
                            All sales on custom orders are FINAL. By placing an order for a personalized item, you acknowledge and agree to this waiver of your right of return.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl mb-2">3. Non-Customized Items</h2>
                        <p>
                            For items that are not personalized (e.g., standard stock items), you have the right to return them within <strong>14 days</strong> of receiving the goods.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Condition:</strong> Items must be unused, in original packaging, and in the same condition that you received them.</li>
                            <li><strong>Return Shipping:</strong> The buyer is responsible for return shipping costs. We recommend using a trackable shipping service. If the item is not returned in its original condition, the buyer is responsible for any loss in value.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl mb-2">4. Damaged or Defective Items</h2>
                        <p>
                            If we made a mistake (e.g., wrong spelling by us, wrong color sent) or if the item arrived damaged:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Please contact us within <strong>48 hours</strong> of delivery.</li>
                            <li>Send clear photos of the damage/mistake.</li>
                            <li>We will send a replacement free of charge. A refund will only be issued if a replacement is not possible.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl mb-2">5. Refused or Undeliverable Packages</h2>
                        <p>
                            If a package is returned to us because the address provided was incorrect or the package was unclaimed, we cannot offer a refund for custom items. The buyer must pay the shipping cost to have the item re-sent.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    )
}
