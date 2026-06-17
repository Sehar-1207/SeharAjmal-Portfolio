"use client";

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  RxDashboard, 
  RxLayers, 
  RxBookmark,   
  RxFileText,    
  RxExternalLink, 
  RxLockOpen2, 
  RxHamburgerMenu, 
  RxCross2 
} from 'react-icons/rx'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isLoginPage = pathname === '/admin/login'

  // Handles cookie purge completely inline via browser document manipulation
  const handleLogout = () => {
    try {
      // Wipes out the admin session tracking token client side instantly
      document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;"
      
      // Forces immediate router sync back to login page
      router.refresh()
      router.push('/admin/login')
    } catch (err) {
      console.error("Logout execution exception:", err)
    }
  }

  if (isLoginPage) return <main className="flex min-h-screen items-center justify-center">{children}</main>

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar - Hidden on mobile, fixed/absolute overlay when open */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r p-6 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg">Admin Console</div>
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <RxCross2 className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <NavLink href="/admin/dashboard" icon={<RxDashboard />} label="Dashboard" active={pathname === '/admin/dashboard'} />
            <NavLink href="/admin/projects" icon={<RxLayers />} label="Projects" active={pathname.startsWith('/admin/projects')} />
            <NavLink href="/admin/certificate" icon={<RxBookmark />} label="Certificates" active={pathname.startsWith('/admin/certificate')} />
            <NavLink href="/admin/resume" icon={<RxFileText />} label="Resumes" active={pathname.startsWith('/admin/resume')} />
            
            <div className="my-4 border-t border-border" />
            
            <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-muted transition">
              <RxExternalLink className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Website</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition w-full">
              <RxLockOpen2 className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center p-4 bg-background border-b border-border">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <RxHamburgerMenu className="h-6 w-6" />
          </button>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  )
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}>
      {React.cloneElement(icon as React.ReactElement)}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}