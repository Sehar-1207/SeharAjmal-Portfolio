'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [projectsCount, setProjectsCount] = useState(0)
  const [certCount, setCertCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, certificates] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true })
        ])

        setProjectsCount(projects.count || 0)
        setCertCount(certificates.count || 0)
      } catch (err) {
        console.error("Metric fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    // Added px-4 to ensure content isn't flush with mobile edges
    <div className="max-w-5xl mx-auto space-y-8 px-4 md:px-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time overview of your portfolio database items.
        </p>
      </div>

      {/* Grid: 1 col on mobile, 2 on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <MetricCard 
          title="Total Projects" 
          value={projectsCount} 
          loading={loading} 
          desc="Live instances mapped to portfolio entries" 
        />
        <MetricCard 
          title="Total Certificates" 
          value={certCount} 
          loading={loading} 
          desc="Verified qualifications saved to cloud storage" 
        />
      </div>
    </div>
  )
}

function MetricCard({ title, value, loading, desc }: { title: string, value: number, loading: boolean, desc: string }) {
  return (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:border-primary/20 transition-all">
      <p className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="text-4xl font-black text-primary mt-3 mb-4">
        {loading ? <span className="animate-pulse opacity-50">--</span> : value}
      </div>
      <div className="text-xs text-muted-foreground/70 border-t border-border pt-4">{desc}</div>
    </div>
  )
}