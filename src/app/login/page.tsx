'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Database, Chrome } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function handleAuth() {
        setLoading(true)
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                        data: { full_name: email.split('@')[0] }
                    },
                })
                if (error) throw error
                toast.success('Check your email to confirm signup!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleGoogleLogin() {
        setGoogleLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error: any) {
            toast.error(error.message)
            setGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] p-4">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-black text-white mb-4">
                    <Database className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                    {isSignUp ? 'Create your account' : 'Sign in to your account'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Start automating your sales workflow today
                </p>
            </div>

            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
                >
                    {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>
                            <Chrome className="w-4 h-4" />
                            Sign in with Google
                        </>
                    )}
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        onClick={handleAuth}
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-900 font-medium flex items-center justify-center transition-colors"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSignUp ? 'Sign up' : 'Sign in')}
                    </button>
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-medium text-black hover:underline"
                >
                    {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
            </p>
        </div>
    )
}
