import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { searchGoogle } from '@/lib/agent/search'
import { generateEmailWithGemini, generateSearchQueries } from '@/lib/agent/gemini'

export async function POST(request: Request) {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 2. Fetch One Pending Job
        // We strictly limit to 1 to avoid Vercel timeout limits
        const { data: job, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_id', user.id) // Only process own jobs
            .eq('status', 'pending')
            .order('created_at', { ascending: true })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found", which is fine
            throw error
        }

        if (!job) {
            return NextResponse.json({ message: 'No pending jobs' })
        }

        // 3. Mark as Processing
        await supabase.from('jobs').update({ status: 'processing' }).eq('id', job.id)

        let result = null

        // 4. Execute Logic
        if (job.type === 'search') {
            const { query } = job.payload

            // Step A: Ask Gemini for intelligent search queries
            const searchQueries = await generateSearchQueries(query)

            // Step B: Execute Search (just the first query to stay fast)
            const searchResults = await searchGoogle(searchQueries[0])

            // Step C: Save Leads (Results)
            for (const res of searchResults) {
                // Naive extraction of Name/Company from snippet
                await supabase.from('leads').insert({
                    user_id: user.id,
                    company: res.title, // Simplified for now
                    notes: res.snippet,
                    linkedin_url: res.link,
                    status: 'new'
                })
            }

            result = { leads_found: searchResults.length, queries: searchQueries }
        }
        else if (job.type === 'draft_email') {
            const { lead_id, context } = job.payload

            // Fetch lead
            const { data: lead } = await supabase.from('leads').select('*').eq('id', lead_id).single()

            if (lead) {
                const emailDraft = await generateEmailWithGemini({
                    name: lead.first_name || 'there',
                    company: lead.company || 'Unknown Company',
                    recon: lead.notes || ''
                }, context)

                // Save draft in notes or separate table? 
                // For simple pipeline, we update 'notes' or add a specialized column. 
                // Let's create an 'emails' table later, but for now just update notes
                await supabase.from('leads').update({
                    status: 'contacted', // or drafted
                    notes: lead.notes + '\n\n--- DRAFT EMAIL ---\n' + emailDraft
                }).eq('id', lead_id)

                result = { email_drafted: true }
            }
        }

        // 5. Mark as Completed
        await supabase
            .from('jobs')
            .update({
                status: 'completed',
                result: result || {}
            })
            .eq('id', job.id)

        return NextResponse.json({ message: 'Job processed', job_id: job.id, result })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
