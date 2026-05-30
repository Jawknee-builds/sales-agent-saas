'use client'

import { useState } from 'react'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function CampaignsPage() {
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleStartCampaign() {
        if (!prompt.trim()) return

        setLoading(true)
        try {
            const res = await fetch('/api/agent/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'search',
                    payload: { query: prompt }
                })
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Failed to start campaign')
            }

            toast.success('Campaign started')
            setPrompt('')
            fetch('/api/agent/process', { method: 'POST' })

        } catch (e: any) {
            toast.error(e.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900">New Campaign</h2>
                <p className="text-gray-500">Describe who you want to reach.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Find marketing agencies in London..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent resize-none text-base outline-none"
                />

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleStartCampaign}
                        disabled={loading || !prompt.trim()}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center gap-2 font-medium disabled:opacity-50 transition-colors"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Start Hunting
                    </button>
                </div>
            </div>
        </div>
    )
}
