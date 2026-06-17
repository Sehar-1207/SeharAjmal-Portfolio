import React from 'react'
import dbConnect from '../lib/mongodb'
import { Project, Certification, Resume } from '../lib/schema'
import { RxLayers, RxBookmark, RxFileText } from 'react-icons/rx'

// Forces Next.js to fetch fresh statistics from MongoDB on every dashboard page view
export const revalidate = 0 

export default async function DashboardPage() {
  await dbConnect()

  // Run database lookups concurrently to optimize load speeds
  const [projectCount, certCount, resumeCount] = await Promise.all([
    Project.countDocuments({}),
    Certification.countDocuments({}),
    Resume.countDocuments({})
  ])

  const statisticsCards = [
    { label: 'Total Projects', count: projectCount, icon: <RxLayers className="h-6 w-6 text-blue-500" />, bg: 'bg-blue-500/10' },
    { label: 'Certifications', count: certCount, icon: <RxBookmark className="h-6 w-6 text-amber-500" />, bg: 'bg-amber-500/10' },
    { label: 'Uploaded Resumes', count: resumeCount, icon: <RxFileText className="h-6 w-6 text-emerald-500" />, bg: 'bg-emerald-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here is a breakdown of your current live portfolio metrics data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statisticsCards.map((card, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground tracking-wide">{card.label}</p>
              <p className="text-3xl font-bold font-mono tracking-tight">{card.count}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Quicklinks section below */}
      <div className="rounded-xl border bg-card p-6 mt-6">
        <h3 className="font-semibold mb-2 text-sm">System Status</h3>
        <p className="text-xs text-muted-foreground font-mono">Database Connection Status: Connected to Cluster Atlas</p>
      </div>
    </div>
  )
}