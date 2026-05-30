import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API /agent/jobs: Auth Check Result:', { user: user?.id, error: authError })

    if (authError || !user) {
        console.error('API Unauthorized:', authError)
        return NextResponse.json({ error: 'Unauthorized: Please Sign Out and Sign In again.' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { type, payload } = body

        if (!type || !payload) {
            return NextResponse.json({ error: 'Missing type or payload' }, { status: 400 })
        }

        // 2. Insert Job
        const { data, error } = await supabase
            .from('jobs')
            .insert({
                user_id: user.id,
                type, // 'search' or 'draft_email'
                payload,
                status: 'pending'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ job: data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
