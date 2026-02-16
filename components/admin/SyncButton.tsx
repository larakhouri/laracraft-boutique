'use client';
import { importGelatoProducts } from '@/app/actions/import-gelato';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SyncButton() {
    const [loading, setLoading] = useState(false);

    const handleSync = async () => {
        setLoading(true);
        const result = await importGelatoProducts();
        if (result.success) {
            alert('LaraCraft: 34 Artisan Formats Synced.');
        } else {
            alert('Sync failed. Check console.');
        }
        setLoading(false);
    };

    return (
        <Button
            onClick={handleSync}
            disabled={loading}
            variant="outline"
            className="w-full border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-2"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Sync Artisan Data'}
        </Button>
    );
}
