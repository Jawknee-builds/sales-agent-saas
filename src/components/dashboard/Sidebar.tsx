'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, Mail, Settings, LogOut, Sparkles } from 'lucide-react'

export default function Sidebar() {
    const router = useRouter()
    const supabase = createClient()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2">
                    <div className="p-1.5 bg-black rounded-md">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    SalesAgent
                </h1>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Overview" />
                <NavItem href="/dashboard/campaigns" icon={<Mail />} label="Campaigns" />
                <NavItem href="/dashboard/leads" icon={<Users />} label="Leads" />
                <NavItem href="/dashboard/settings" icon={<Settings />} label="Settings" />
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 w-full transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <span className="w-4 h-4 text-gray-400">{icon}</span>
            {label}
        </Link>
    )
}
