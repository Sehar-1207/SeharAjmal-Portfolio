'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import {
  RxDashboard,
  RxFileText,
  RxLayers,
  RxExternalLink, // Beautiful alternative for "Back to Site"
  RxLockOpen2     // Beautiful alternative for "Logout"
} from 'react-icons/rx'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (isLoginPage) {
    return <main className="flex min-h-screen items-center justify-center">{children}</main>
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background p-6 flex flex-col justify-between">

        <div className="flex flex-col gap-6">
          <div className="font-bold text-lg">Admin Console</div>

          <nav className="flex flex-col gap-2">
            {/* Primary Navigation */}
            <NavLink href="/admin/dashboard" icon={<RxDashboard />} label="Dashboard" active={pathname === '/admin/dashboard'} />
            <NavLink href="/admin/projects" icon={<RxLayers />} label="Projects" active={pathname.startsWith('/admin/projects')} />
            <NavLink href="/admin/certificate" icon={<RxFileText />} label="Certificates" active={pathname.startsWith('/admin/certificate')} />

            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-muted transition"
            >
              <RxExternalLink className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition w-full"
            >
              <RxLockOpen2 className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 bg-muted/20 p-8">{children}</main>
    </div>
  )
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}