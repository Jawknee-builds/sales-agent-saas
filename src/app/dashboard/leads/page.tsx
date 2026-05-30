'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, Search, Mail, Loader2 } from 'lucide-react'

interface Lead {
    id: string
    company: string
    notes: string
    status: string
    linkedin_url: string
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchLeads()
    }, [])

    async function fetchLeads() {
        setLoading(true)
        const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
        if (data) setLeads(data)
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Lead
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : leads.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No leads found. Start a campaign to find some!
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Notes</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {lead.company}
                                        <div className="text-xs text-indigo-600 font-normal truncate max-w-[200px]">
                                            {lead.linkedin_url}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                                lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                            {lead.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 max-w-sm truncate">
                                        {lead.notes}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm border px-3 py-1 rounded hover:bg-gray-50 flex items-center gap-2 ml-auto">
                                            <Mail className="w-3 h-3" /> Draft Email
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
