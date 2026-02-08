import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // 1. Verify User
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    if (user.email !== 'lara.khouri19@gmail.com') {
        return NextResponse.json(
            { error: 'Forbidden: You are not authorized to perform this action.' },
            { status: 403 }
        )
    }

    try {
        const body = await request.json()
        const { title, description, price, category, image_url } = body

        // 2. Insert into Supabase
        const { data, error } = await supabase
            .from('products')
            .insert({
                title,
                description,
                price,
                category,
                image_url
            })
            .select()

        if (error) {
            throw error
        }

        return NextResponse.json(
            { message: 'Product Saved Successfully', data },
            { status: 200 }
        )

    } catch (error: any) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
