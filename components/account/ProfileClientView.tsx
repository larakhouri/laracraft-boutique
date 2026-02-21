'use client'
import { useState } from 'react'

// 🎯 Explicitly use the current directory (.)
import ProfileEditForm from './ProfileEditForm'
import OrderLedger from './OrderLedger'
import WishlistArchive from './WishlistArchive'

export default function ProfileClientView({ profile, orders, wishlist }: any) {
    const [tab, setTab] = useState('account')

    return (
        <div className="space-y-12">
            <div className="flex gap-8 border-b border-stone-200">
                {['account', 'orders', 'wishlist'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`pb-4 text-[10px] uppercase tracking-widest font-bold border-b-2 transition-all
                        ${tab === t ? 'border-[#004d4d] text-[#004d4d]' : 'border-transparent text-stone-400'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {tab === 'account' && <ProfileEditForm profile={profile} />}
                {tab === 'orders' && <OrderLedger orders={orders} />}
                {tab === 'wishlist' && <WishlistArchive items={wishlist} />}
            </div>
        </div>
    )
}