'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react'
import { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default function ProjectShare({ project }: { project: any }) {
    const [copied, setCopied] = useState(false)

    // Construct the public URL
    // In dev: http://localhost:3000/passport/[token]
    // In prod: https://your-domain.com/passport/[token]
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = `${origin}/share/${project.share_token}`

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg font-serif">{project.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wide
                                ${project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
                                {project.status}
                            </span>
                            <span className="text-xs text-stone-400">
                                • {(project.progress_updates as any[])?.length || 0} updates
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs uppercase tracking-wider h-9"
                        onClick={handleCopy}
                    >
                        {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                        {copied ? 'Copied' : 'Copy Link'}
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <QrCode className="w-4 h-4 text-stone-600" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 bg-white">
                            <div className="text-center">
                                <p className="text-xs font-bold mb-2 uppercase tracking-wide text-stone-500">Scan to View</p>
                                <QRCodeSVG value={shareUrl} size={128} level="M" />
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                        <Link href={`/passport/${project.share_token}`} target="_blank">
                            <ExternalLink className="w-4 h-4 text-stone-400 hover:text-primary" />
                        </Link>
                    </Button>
                </div>

                {/* Mobile Studio Link (Only visible to Admin) */}
                <div className="mt-4 pt-4 border-t border-stone-100">
                    <Link
                        href={`/admin/projects/${project.id}/update`}
                        className="block text-center text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 py-2 rounded-md transition-colors"
                    >
                        Open Studio Uploader
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
