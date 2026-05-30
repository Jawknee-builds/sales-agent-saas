import { Users, Mail, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                <p className="text-gray-500">Welcome back! Here is your pipeline performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Leads" value="142" icon={<Users className="w-5 h-5 text-indigo-600" />} />
                <StatCard title="Emails Sent" value="89" icon={<Mail className="w-5 h-5 text-green-600" />} />
                <StatCard title="Response Rate" value="12%" icon={<TrendingUp className="w-5 h-5 text-orange-600" />} />
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                <h3 className="text-lg font-semibold text-indigo-900">Ready to find more customers?</h3>
                <p className="text-indigo-700 max-w-md">Launch a new AI Search Campaign to fill your pipeline with 50+ fresh leads.</p>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium">
                    Start New Campaign
                </button>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
        </div>
    )
}
