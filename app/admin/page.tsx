'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <main className="flex min-h-screen items-center justify-center">{children}</main>
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/20">
        <nav className="p-4">
            <h2 className="font-bold text-sm mb-4">Admin Console</h2>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}