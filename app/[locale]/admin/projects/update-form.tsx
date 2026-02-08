'use client'

import { useActionState } from 'react'
import { updateProjectProgress } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const initialState = {
    message: '',
    error: '',
}

export default function UpdateForm({ projects }: { projects: any[] }) {
    const [state, action, isPending] = useActionState(updateProjectProgress, initialState)

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Record Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={action} className="space-y-4">
                    <div>
                        <Label htmlFor="projectId">Select Project</Label>
                        <select name="projectId" id="projectId" className="w-full p-2 border rounded-md" required>
                            <option value="">-- Choose Project --</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>{p.title} ({p.status})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="note">Journal Note</Label>
                        <Textarea name="note" id="note" placeholder="What did you create today?" required />
                    </div>

                    <div>
                        <Label htmlFor="image">Result Image</Label>
                        <Input type="file" name="image" id="image" accept="image/*" required />
                    </div>

                    {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
                    {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}

                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Uploading...' : 'Save Update'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
