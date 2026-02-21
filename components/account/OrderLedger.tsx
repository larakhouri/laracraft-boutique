'use client'

export default function OrderHistory({ orders }: { orders: any[] }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="py-12 text-center border border-stone-100 bg-[#fdfcf8]">
                <h3 className="font-serif text-2xl italic text-stone-400 mb-2">No Commissions Yet</h3>
                <p className="text-[10px] uppercase tracking-widest text-stone-400">Your artisan ledger is currently empty.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-stone-200">
                            <th className="py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Order ID</th>
                            <th className="py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-stone-100">
                                <td className="py-4 text-sm font-mono text-stone-600">#{order.id.slice(0, 8)}</td>
                                <td className="py-4 text-sm text-right font-medium text-[#004d4d]">
                                    €{order.total_amount?.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}