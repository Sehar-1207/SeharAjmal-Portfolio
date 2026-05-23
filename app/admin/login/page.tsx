'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { RxLockClosed, RxEnvelopeClosed, RxEyeOpen, RxEyeNone } from 'react-icons/rx'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      window.location.href = '/admin/dashboard'
    } else {
      setError('Login failed: No session created')
      setLoading(false)
    }
  }

  return (
    // h-screen ensures it fills the viewport exactly, flex centers it perfectly
    <div className="h-screen w-full flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl p-8">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-3">
            <RxLockClosed className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Console Access</h1>
          <p className="text-xs text-muted-foreground mt-1">Sign in to manage your infrastructure.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold px-1">Email</label>
            <div className="relative flex items-center">
              <RxEnvelopeClosed className="absolute left-3.5 text-muted-foreground h-4 w-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold px-1">Security Key</label>
            <div className="relative flex items-center">
              <RxLockClosed className="absolute left-3.5 text-muted-foreground h-4 w-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <RxEyeNone className="h-4 w-4" /> : <RxEyeOpen className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground text-sm font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}