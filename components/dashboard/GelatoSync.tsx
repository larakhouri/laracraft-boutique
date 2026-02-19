'use client'

import { useState, useEffect } from 'react'
import { fetchGelatoProducts, syncGelatoProduct } from '@/app/actions/gelato'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function GelatoSync() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [syncing, setSyncing] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [targetVault, setTargetVault] = useState<'gallery' | 'printed'>('printed')

    const loadProducts = async () => {
        setLoading(true)
        const data = await fetchGelatoProducts()
        setProducts(data)
        setLoading(false)
    }

    const handleSync = async () => {
        if (selectedIds.length === 0) return

        setSyncing(true)
        let successCount = 0

        for (const id of selectedIds) {
            const product = products.find(p => p.id === id)
            if (product) {
                const result = await syncGelatoProduct(product, targetVault)
                if (result.success) successCount++
            }
        }

        setSyncing(false)
        setSelectedIds([]) // Reset selection
        alert(`Synced ${successCount} products to ${targetVault === 'gallery' ? 'Gallery' : 'Printed Designs'}`)
    }

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    return (
        <Card className="border-stone-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-serif text-lg text-stone-800 flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Gelato Sync Gate
                </CardTitle>
                <Button variant="outline" size="sm" onClick={loadProducts} disabled={loading}>
                    {loading ? 'Fetching...' : 'Check Geleto'}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Controls */}
                    <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-lg border border-stone-100">
                        <Select value={targetVault} onValueChange={(v: any) => setTargetVault(v)}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Target Vault" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="printed">Printed Designs</SelectItem>
                                <SelectItem value="gallery">Fine Art Gallery</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={handleSync}
                            disabled={syncing || selectedIds.length === 0}
                            className="bg-[#2A8B8B] hover:bg-[#237070] text-white ml-auto"
                        >
                            {syncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Sync {selectedIds.length} Items
                        </Button>
                    </div>

                    {/* List */}
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                        {products.length === 0 && !loading && (
                            <p className="text-sm text-stone-400 text-center py-8">No drafts found in Gelato.</p>
                        )}

                        {products.map((product) => (
                            <div key={product.id} className="flex items-center gap-3 p-2 border border-stone-100 rounded hover:bg-stone-50 transition-colors">
                                <Checkbox
                                    checked={selectedIds.includes(product.id)}
                                    onCheckedChange={() => toggleSelection(product.id)}
                                />
                                <div className="h-10 w-10 relative bg-stone-200 rounded overflow-hidden flex-shrink-0">
                                    {product.previewUrl ? (
                                        <Image src={product.previewUrl} alt="preview" fill className="object-cover" />
                                    ) : (
                                        <ImageIcon className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-stone-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-stone-700 truncate">{product.title || 'Untitled Draft'}</p>
                                    <p className="text-xs text-stone-400">ID: {product.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
