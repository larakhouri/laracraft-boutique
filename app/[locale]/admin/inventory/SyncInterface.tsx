'use client'
import React, { useState } from 'react'
import { syncAllArtisanVaults } from '@/app/actions/sync-gelato'
import { RefreshCw } from 'lucide-react'

// 🟢 Define the interface so TypeScript doesn't complain about 'target'
interface SyncInterfaceProps {
    target?: string;
}

export default function SyncInterface({ target = 'all' }: SyncInterfaceProps) {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        const displayTarget = target === 'all' ? 'Universal Vaults' : target.replace('_', ' ');
        if (!confirm(`Start synchronization for: ${displayTarget}?`)) return;

        setIsSyncing(true);
        try {
            // Passes the target (all, printed_designs, etc.) to your server action
            await syncAllArtisanVaults(target);
            alert("Synchronization Complete.");
        } catch (error) {
            console.error(error);
            alert("Sync Failed.");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-[#003D4D] hover:bg-[#002b36] text-white px-8 py-2.5 rounded-full flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg border border-white/10"
        >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                {isSyncing ? 'Synchronizing...' : `Sync ${target === 'all' ? 'Master Vault' : target.replace('_', ' ')}`}
            </span>
        </button>
    )
}