'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getCertificates } from '../../service/certificateService'
import { Certificate } from './typeCertificate'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCertificates = async () => {
    setLoading(true)
    const { data, error } = await getCertificates()

    if (error) {
      console.error('Error fetching certificates:', error.message)
      setLoading(false)
      return
    }

    setCertificates(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCertificates()

    const channel = supabase
      .channel('certificates-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'certificates' },
        () => {
          fetchCertificates()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Certificates</h1>

      {loading && (
        <p className="text-gray-400">Loading certificates...</p>
      )}

      {!loading && certificates.length === 0 && (
        <p className="text-gray-400">No certificates found.</p>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {certificates.map((c) => (
          <div
            key={c.id}
            className="bg-gray-900 p-4 rounded hover:scale-[1.02] transition"
          >
            {c.image_url && (
              <img
                src={c.image_url}
                alt={c.title}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <h2 className="mt-3 font-bold text-white">{c.title}</h2>
            <p className="text-sm text-gray-400">{c.issuer}</p>
            <p className="text-xs text-gray-500 mt-1">{c.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}