import { syncPrintifyProducts } from '@/lib/printify/sync'
import { headers } from 'next/headers'

export async function POST(request: Request) {
    // Verification info (optional but recommended for production)
    // Printify doesn't sign requests by default in the same way Stripe does, 
    // but you can check user-agent or a secret query param if configured.
    // For now, we open the endpoint but trigger the secure server action.

    // You might want to parse the body to see specifically WHICH product changed,
    // but running the full sync is safer to ensure consistency for now.
    const body = await request.json()

    // Basic check to ensure it's a relevant event
    if (body.type === 'shop:product:published' || body.event === 'shop:product:published') {
        console.log('Received Printify publish event. Triggering sync...')
        await syncPrintifyProducts()
        return new Response('Sync triggered', { status: 200 })
    }

    // Allow manual triggers for testing or other events
    // await syncPrintifyProducts()

    return new Response('Event received', { status: 200 })
}
