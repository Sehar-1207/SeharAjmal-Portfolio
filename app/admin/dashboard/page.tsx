'use client'

import { useEffect, useState } from 'react'
import { 
  RxLayers, 
  RxBookmark, 
  RxFileText, 
  RxDesktop, 
  RxServer, 
  RxCode, 
  RxGear 
} from 'react-icons/rx'
import { getProjects } from '@/app/service/projectService'
import { getCertificates } from '@/app/service/certificateService'
import { getResumes } from '@/app/service/resumeService'

// Custom interface schema assuming project types exist on your dataset profile models
interface ProjectItem {
  category?: string
  type?: string
  [key: string]: any
}

export default function DashboardPage() {
  const [projectsCount, setProjectsCount] = useState(0)
  const [frontendCount, setFrontendCount] = useState(0)
  const [backendCount, setBackendCount] = useState(0)
  const [fullstackCount, setFullstackCount] = useState(0)
  const [automationCount, setAutomationCount] = useState(0)
  
  const [certCount, setCertCount] = useState(0)
  const [resumeCount, setResumeCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, certificatesRes, resumesRes] = await Promise.all([
          getProjects(),
          getCertificates(),
          getResumes()
        ])

        if (projectsRes?.success && Array.isArray(projectsRes.data)) {
          const rawProjects: ProjectItem[] = projectsRes.data
          setProjectsCount(rawProjects.length)

          // Filter subsets based on typical normalization tags (lowercased for match safety)
          setFrontendCount(rawProjects.filter(p => {
            const val = (p.category || p.type || '').toLowerCase();
            return val === 'frontend' || val === 'front-end';
          }).length)

          setBackendCount(rawProjects.filter(p => {
            const val = (p.category || p.type || '').toLowerCase();
            return val === 'backend' || val === 'back-end';
          }).length)

          setFullstackCount(rawProjects.filter(p => {
            const val = (p.category || p.type || '').toLowerCase();
            return val === 'fullstack' || val === 'full stack' || val === 'full-stack';
          }).length)

          setAutomationCount(rawProjects.filter(p => {
            const val = (p.category || p.type || '').toLowerCase();
            return val === 'automation' || val === 'devops';
          }).length)
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

  const coreMetrics = [
    { 
      title: "Total Projects", 
      value: projectsCount, 
      desc: "Comprehensive active portfolio records", 
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

  const projectBreakdownMetrics = [
    { 
      title: "Frontend Dev", 
      value: frontendCount, 
      desc: "Client interfaces and styling layouts", 
      icon: <RxDesktop className="h-4 w-4 text-sky-500" />, 
      bg: "bg-sky-500/10" 
    },
    { 
      title: "Backend Core", 
      value: backendCount, 
      desc: "Server structures, nodes and API layers", 
      icon: <RxServer className="h-4 w-4 text-purple-500" />, 
      bg: "bg-purple-500/10" 
    },
    { 
      title: "Full Stack", 
      value: fullstackCount, 
      desc: "End-to-end operational codebases", 
      icon: <RxCode className="h-4 w-4 text-indigo-500" />, 
      bg: "bg-indigo-500/10" 
    },
    { 
      title: "Automation", 
      value: automationCount, 
      desc: "Workflows, scripts and pipeline nodes", 
      icon: <RxGear className="h-4 w-4 text-rose-500" />, 
      bg: "bg-rose-500/10" 
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 box-border overflow-x-hidden">
      {/* Header View */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your portfolio database items.
        </p>
      </div>

      {/* Core Summary Grid Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground/80 font-bold">Global Entities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {coreMetrics.map((card, idx) => (
            <MetricCard
              key={idx}
              title={card.title}
              value={card.value}
              loading={loading}
              desc={card.desc}
              icon={card.icon}
              bg={card.bg}
              variant="large"
            />
          ))}
        </div>
      </div>

      {/* Project Matrix Segmentation Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground/80 font-bold">Project Segment Map</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {projectBreakdownMetrics.map((card, idx) => (
            <MetricCard
              key={idx}
              title={card.title}
              value={card.value}
              loading={loading}
              desc={card.desc}
              icon={card.icon}
              bg={card.bg}
              variant="compact"
            />
          ))}
        </div>
      </div>

      {/* System Operational Card Footer */}
      <div className="rounded-xl border bg-card/50 p-5 mt-6 border-border/60">
        <h3 className="font-semibold text-sm mb-1 text-foreground">Infrastructure Status</h3>
        <p className="text-[11px] text-muted-foreground font-mono">
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
  variant?: 'large' | 'compact'
}

function MetricCard({ title, value, loading, desc, icon, bg, variant = 'large' }: MetricCardProps) {
  const isLarge = variant === 'large'
  
  return (
    <div className={`bg-card border border-border rounded-2xl shadow-sm hover:border-primary/20 transition-all flex flex-col justify-between ${
      isLarge ? 'p-6 min-h-[150px]' : 'p-4 sm:p-5 min-h-[125px]'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-muted-foreground truncate">
            {title}
          </p>
          <div className={`p-1.5 sm:p-2 rounded-xl shrink-0 ${bg}`}>
            {icon}
          </div>
        </div>
        
        <div className={`font-mono text-foreground font-black tracking-tight mt-1 sm:mt-2 ${
          isLarge ? 'text-3xl mb-2 sm:mb-3' : 'text-2xl mb-1'
        }`}>
          {loading ? (
            <span className="animate-pulse opacity-40">--</span>
          ) : (
            value
          )}
        </div>
      </div>

      <div className="text-[10px] sm:text-xs text-muted-foreground/60 border-t border-border/40 pt-2 sm:pt-3 mt-auto line-clamp-1" title={desc}>
        {desc}
      </div>
    </div>
  )
}