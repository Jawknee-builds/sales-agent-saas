'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Save, Loader2, FileText, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [context, setContext] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchProfile()
    }, [])

    async function fetchProfile() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase.from('profiles').select('company_name').eq('id', user.id).single()
        // We would need a 'context' column in profiles, let's assume we added it or use a separate table
        // For MVP, letting user just type company name + pitch
        if (data?.company_name) setContext(data.company_name) // Using company_name field for now

        setLoading(false)
    }

    async function handleSave() {
        setSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('profiles').update({ company_name: context }).eq('id', user.id)
            toast.success('Knowledge Base Updated')
        }
        setSaving(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
                <p className="text-gray-500">Train your agent. Upload your pitch, pricing, and value proposition here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Product Context / Elevator Pitch</label>
                        <p className="text-xs text-gray-500">
                            Paste your "One Pager" or text from your Pitch Deck here. The Agent reads this before writing every email.
                        </p>
                        <textarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            className="w-full h-64 p-3 border rounded-md focus:ring-indigo-500 text-sm"
                            placeholder="We sell an AI-powered CRM that helps dentists get more patients..."
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Context
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="flex items-center gap-2 font-semibold text-blue-900">
                            <FileText className="w-5 h-5" /> Tips
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm text-blue-800">
                            <li className="flex gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5" /> Include your Pricing tiers.
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5" /> List your top 3 Case Studies.
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5" /> Define your Ideal Customer Profile (ICP).
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
