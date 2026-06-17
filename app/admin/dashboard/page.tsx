'use client'

import { useEffect, useState } from 'react'
import { RxLayers, RxBookmark, RxFileText } from 'react-icons/rx'
import { getProjects } from '@/app/service/projectService'
import { getCertificates } from '@/app/service/certificateService'
import { getResumes } from '@/app/service/resumeService'

export default function DashboardPage() {
  const [projectsCount, setProjectsCount] = useState(0)
  const [certCount, setCertCount] = useState(0)
  const [resumeCount, setResumeCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 2. Fetch data in parallel using your Mongoose action wrappers
        const [projectsRes, certificatesRes, resumesRes] = await Promise.all([
          getProjects(),
          getCertificates(),
          getResumes()
        ])

        // 3. Map array counts straight to your numeric metric states safely
        if (projectsRes?.success && Array.isArray(projectsRes.data)) {
          setProjectsCount(projectsRes.data.length)
        }
        if (certificatesRes?.success && Array.isArray(certificatesRes.data)) {
          setCertCount(certificatesRes.data.length)
        }
        if (resumesRes?.success && Array.isArray(resumesRes.data)) {
          setResumeCount(resumesRes.data.length)
        }
      } catch (err) {
        console.error("Metric fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statisticsCards = [
    { 
      title: "Total Projects", 
      value: projectsCount, 
      desc: "Live instances mapped to portfolio entries", 
      icon: <RxLayers className="h-5 w-5 text-blue-500" />, 
      bg: "bg-blue-500/10" 
    },
    { 
      title: "Total Certificates", 
      value: certCount, 
      desc: "Verified qualifications saved to database", 
      icon: <RxBookmark className="h-5 w-5 text-amber-500" />, 
      bg: "bg-amber-500/10" 
    },
    { 
      title: "Total Resumes", 
      value: resumeCount, 
      desc: "Application copies ready for distribution", 
      icon: <RxFileText className="h-5 w-5 text-emerald-500" />, 
      bg: "bg-emerald-500/10" 
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your portfolio database items.
        </p>
      </div>

      {/* Grid adapts cleanly for 3 items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {statisticsCards.map((card, idx) => (
          <MetricCard
            key={idx}
            title={card.title}
            value={card.value}
            loading={loading}
            desc={card.desc}
            icon={card.icon}
            bg={card.bg}
          />
        ))}
      </div>

      {/* System Operational Card Footer */}
      <div className="rounded-xl border bg-card p-6 mt-6">
        <h3 className="font-semibold text-sm mb-1">Infrastructure Status</h3>
        <p className="text-xs text-muted-foreground font-mono">
          Database Cluster Connection: Active & Synced
        </p>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  loading: boolean
  desc: string
  icon: React.ReactNode
  bg: string
}

function MetricCard({ title, value, loading, desc, icon, bg }: MetricCardProps) {
  return (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:border-primary/20 transition-all flex flex-col justify-between min-h-[160px]">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className={`p-2 rounded-xl ${bg}`}>
            {icon}
          </div>
        </div>
        
        <div className="text-3xl font-black text-foreground font-mono tracking-tight mt-2 mb-3">
          {loading ? (
            <span className="animate-pulse opacity-40">--</span>
          ) : (
            value
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground/70 border-t border-border pt-3 mt-auto">
        {desc}
      </div>
    </div>
  )
}