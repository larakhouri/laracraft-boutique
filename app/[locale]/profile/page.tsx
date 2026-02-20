'use client'
import { useState } from 'react'

import ProfileEditForm from '@/components/account/ProfileEditForm'
const OrderHistory = ({ orders }: any) => <div className="p-8 border border-stone-100 bg-white">Order History (Coming Soon)</div>
const WishlistGrid = ({ items }: any) => <div className="p-8 border border-stone-100 bg-white">Wishlist (Coming Soon)</div>

export default function ProfilePage({ profile, orders, wishlist }: any) {
    const [activeTab, setActiveTab] = useState('account')

    return (
        <div className="max-w-6xl mx-auto py-24 px-6 font-sans">
            {/* 🟢 TABS: Account | Orders | Wishlist */}
            <div className="flex gap-12 border-b border-stone-100 mb-12">
                {['account', 'orders', 'wishlist'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all
                        ${activeTab === tab ? 'border-b-2 border-[#004d4d] text-[#004d4d]' : 'text-stone-400'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'account' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* User can edit Email, Password, and Address here */}
                    <ProfileEditForm profile={profile} />
                </div>
            )}

            {activeTab === 'orders' && <OrderHistory orders={orders} />}
            {activeTab === 'wishlist' && <WishlistGrid items={wishlist} />}
        </div>
    )
}
