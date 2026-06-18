'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RxLockClosed, RxEnvelopeClosed, RxEyeOpen, RxEyeNone } from 'react-icons/rx'
import { loginAdmin } from './action'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      const result = await loginAdmin(formData)

      if (!result.success) {
        setError(result.error)
        setLoading(false)
        return
      }

      router.refresh()
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError('An unexpected connection error occurred.')
      setLoading(false)
    }
  }

  return (
    /* 📱 Responsive viewport centering wrapper */
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-muted/10">
      
      {/* Container adapts width fluidly across small mobile viewports up to max-w-md */}
      <div className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl p-6 sm:p-8 transition-all">
        
        {/* Header Branding */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-3">
            <RxLockClosed className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Console Access</h1>
          <p className="text-xs text-muted-foreground mt-1">Sign in to manage your infrastructure.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold rounded-xl transition-all break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold px-1">Email</label>
            <div className="relative flex items-center">
              <RxEnvelopeClosed className="absolute left-3.5 text-muted-foreground h-4 w-4 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                placeholder="admin@domain.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold px-1">Security Key</label>
            <div className="relative flex items-center">
              <RxLockClosed className="absolute left-3.5 text-muted-foreground h-4 w-4 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 min-h-[44px] rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 h-full flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <RxEyeNone className="h-4 w-4" /> : <RxEyeOpen className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground text-sm font-bold py-3.5 min-h-[44px] rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}