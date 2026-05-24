'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { getCertificates, addCertificate, updateCertificate, deleteCertificate } from '../../service/certificateService'
import { uploadImage } from '../../lib/uploadImage'
import { Certificate } from './typeCertificate'
import { RxPencil1, RxTrash, RxIdCard, RxUpload } from 'react-icons/rx' 

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [issuer, setIssuer] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [image_url, setImage_url] = useState('')
  
  const [imageUploading, setImageUploading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchCerts = async () => {
    setLoading(true)
    const { data, error } = await getCertificates()
    if (error) console.error('Error fetching certs:', error.message)
    else setCerts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCerts()
    const channel = supabase
      .channel('certs-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates' }, () => fetchCerts())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setImageUploading(true)
      const uploadedUrl = await uploadImage(file)
      setImage_url(uploadedUrl) 
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`)
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)
    const certData = { title, issuer, date, image_url, description }
    const { error } = editingId 
      ? await updateCertificate(editingId, certData) 
      : await addCertificate(certData)
    setFormSubmitting(false)
    if (error) alert(`Error: ${error.message}`)
    else { clearForm(); fetchCerts() }
  }

  const clearForm = () => {
    setEditingId(null)
    setTitle(''); setIssuer(''); setDate(''); setImage_url(''); setDescription('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-8 text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Manage Certificates</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage your professional credentials.</p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-card p-5 md:p-6 rounded-2xl border border-border space-y-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <RxIdCard /> {editingId ? 'Edit Certificate' : 'Add New Certificate'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Title" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Issuer" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm" value={issuer} onChange={(e) => setIssuer(e.target.value)} required />
          <input type="text" placeholder="Date (e.g., Oct 2025)" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm" value={date} onChange={(e) => setDate(e.target.value)} required />
          
          <div className="w-full min-h-[44px] flex items-center bg-muted/60 rounded-xl border border-border px-3">
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="text-xs w-full file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-primary file:text-white file:border-0 cursor-pointer" />
          </div>
          
          <textarea placeholder="Description" className="md:col-span-2 p-3 rounded-xl bg-muted/60 border border-border h-24 text-sm" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {image_url && !imageUploading && (
          <img src={image_url} className="w-20 h-20 object-cover rounded-lg border border-border" alt="Preview" />
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button type="submit" disabled={formSubmitting || imageUploading} className="w-full sm:flex-1 bg-primary text-white p-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {formSubmitting ? 'Saving...' : editingId ? 'Update Certificate' : 'Publish Certificate'}
          </button>
          {editingId && (
            <button type="button" onClick={clearForm} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-muted font-bold hover:bg-muted/80 transition-colors">Cancel</button>
          )}
        </div>
      </form>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((c) => (
          <div key={c.id} className="bg-card border border-border p-5 rounded-2xl flex flex-col hover:shadow-md transition-shadow">
            <img src={c.image_url} alt={c.title} className="w-full h-40 object-cover bg-muted/20 rounded-lg mb-4" />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{c.title}</h3>
              <p className="text-xs text-muted-foreground">{c.issuer} • {c.date}</p>
              <p className="text-xs mt-2 text-muted-foreground line-clamp-2">{c.description}</p>
            </div>
            <div className="flex gap-2 pt-4">
              <button onClick={() => { setEditingId(c.id); setTitle(c.title); setIssuer(c.issuer); setDate(c.date); setImage_url(c.image_url); setDescription(c.description || ''); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex-1 bg-muted py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-muted/80"><RxPencil1 /> Edit</button>
              <button onClick={() => setDeleteId(c.id)} className="flex-1 bg-destructive/10 text-destructive py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-destructive/20"><RxTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-3xl shadow-2xl max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold">Delete Certificate?</h3>
            <p className="text-sm text-muted-foreground">This action will remove the certificate and its image permanently.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-3 rounded-xl bg-muted font-bold hover:bg-muted/80">Cancel</button>
              <button onClick={async () => { const cert = certs.find(c => c.id === deleteId); if(cert) { await deleteCertificate(cert.id, cert.image_url); setDeleteId(null); fetchCerts(); } }} className="flex-1 px-4 py-3 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/90">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}