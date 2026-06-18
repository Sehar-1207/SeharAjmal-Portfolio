'use client'

import { useEffect, useState, useRef } from 'react'
import { 
  getCertificates, 
  addCertificate, 
  updateCertificate, 
  deleteCertificate 
} from '@/app/service/certificateService'
import { uploadFile } from '@/app/lib/cloudinary' 
import { 
  RxPencil1, 
  RxTrash, 
  RxIdCard, 
  RxCross2, 
  RxPlus, 
  RxArrowLeft 
} from 'react-icons/rx' 

interface CertificateFrontend {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  image_url: string;
  publicId: string;
  order: number;
}

type ViewState = 'list' | 'form';

export default function CertificatesPage() {
  const [certs, setCerts] = useState<CertificateFrontend[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewState>('list')

  // Form Field States
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [issuer, setIssuer] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [image_url, setImage_url] = useState('')
  const [publicId, setPublicId] = useState('') 
  
  // Interface state flags
  const [imageUploading, setImageUploading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Fetch data from MongoDB Atlas via Server Action
  const fetchCerts = async () => {
    try {
      setLoading(true)
      const result = await getCertificates()
      if (!result.success) {
        console.error('Error fetching certs:', result.error)
      } else if (result.data) {
        const mappedData: CertificateFrontend[] = result.data.map((c: any) => ({
          id: c._id || c.id,
          title: c.title,
          issuer: c.issuer,
          date: c.issueDate || c.date || '',
          description: c.description || '',
          image_url: c.image?.url || c.image_url || '',
          publicId: c.image?.publicId || c.publicId || '',
          order: c.order ?? 0
        }))
        mappedData.sort((a, b) => a.order - b.order)
        setCerts(mappedData)
      }
    } catch (err) {
      console.error('Unexpected fetch failure:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCerts()
  }, [])

  // 2. Handle Cloudinary Image stream uploading
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setImageUploading(true)
      
      const uploadData = new FormData()
      uploadData.append('file', file)
      
      const result = await uploadFile(uploadData)
      
      if (!result.success || !result.data) {
        alert(`Upload failed: ${result.error}`)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        setImage_url(result.data.url)
        setPublicId(result.data.publicId)
      }
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`)
    } finally {
      setImageUploading(false)
    }
  }

  // 3. Handle data saving paths (Insert vs Update conditional routes)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!image_url) {
      alert('Please upload an image before publishing.')
      return
    }

    setFormSubmitting(true)
    
    const serverPayload = {
      title,
      issuer,
      issueDate: date,
      description,
      image: { url: image_url, publicId: publicId }
    }
    
    let result;
    if (editingId) {
      result = await updateCertificate(editingId, serverPayload)
    } else {
      result = await addCertificate(serverPayload)
    }
      
    setFormSubmitting(false)
    
    if (!result.success) {
      alert(`Error saving credentials configuration: ${result.error}`)
    } else { 
      clearForm()
      setView('list')
      fetchCerts() 
    }
  }

  const clearForm = () => {
    setEditingId(null)
    setTitle(''); setIssuer(''); setDate(''); setImage_url(''); setDescription(''); setPublicId('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEditClick = (c: CertificateFrontend) => {
    setEditingId(c.id); 
    setTitle(c.title); 
    setIssuer(c.issuer); 
    setDate(c.date); 
    setImage_url(c.image_url); 
    setPublicId(c.publicId); 
    setDescription(c.description || ''); 
    setView('form');
  }

  return (
    <div className="space-y-8 text-foreground px-4 md:px-0 max-w-7xl mx-auto py-10 min-h-screen bg-transparent">
      
      {/* HEADER SECTION CONTROLS */}
      <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Manage Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, or remove professional credentials.
          </p>
        </div>
        {view === 'list' && (
          <button
            onClick={() => { clearForm(); setView('form'); }}
            className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-xl hover:opacity-90 transition shadow-sm text-sm"
          >
            <RxPlus className="h-5 w-5" /> Add Certificate
          </button>
        )}
      </div>

      {/* DASHBOARD DISPLAY VIEW */}
      {view === 'list' && (
        <>
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground animate-pulse">Loading certificates registry...</div>
          ) : certs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl text-sm text-muted-foreground bg-transparent">
              No professional credentials added to this index cluster yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((c) => (
                <div
                  key={c.id}
                  className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm hover:border-primary/20 transition-all relative select-none"
                >
                  <div className="relative h-44 w-full bg-muted/20 overflow-hidden border-b border-border/40">
                    <img src={c.image_url} alt={c.title} className="w-full h-full object-cover pointer-events-none" />
                  </div>

                  <div className="p-5 flex-1 space-y-1.5">
                    <h3 className="font-bold text-base tracking-tight line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-muted-foreground">{c.issuer} • {c.date}</p>
                    <p className="text-xs pt-1.5 text-muted-foreground line-clamp-2 leading-relaxed">
                      {c.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="p-5 pt-0 mt-2">
                    <div className="flex gap-2.5 pt-3 border-t border-border/40">
                      <button onClick={() => handleEditClick(c)} className="flex-1 flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 py-2.5 rounded-xl text-xs font-bold transition"><RxPencil1 className="text-amber-500" /> Edit</button>
                      <button onClick={() => setDeleteId(c.id)} className="flex-1 flex items-center justify-center gap-1.5 bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground text-destructive py-2.5 rounded-xl text-xs font-bold transition"><RxTrash /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* NEW PAGE ISOLATED FORM VIEW */}
      {view === 'form' && (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button 
            type="button" 
            onClick={() => { clearForm(); setView('list'); }} 
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <RxArrowLeft className="text-base" /> Back to List View
          </button>

          <form onSubmit={handleSubmit} className="bg-card p-5 md:p-6 rounded-2xl border border-border space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <RxIdCard className="text-xl" /> {editingId ? 'Edit Certificate Entry' : 'Add New Certificate'}
            </h2>
            
            <div className="space-y-4">
              <input type="text" placeholder="Title" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input type="text" placeholder="Issuer" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={issuer} onChange={(e) => setIssuer(e.target.value)} required />
              <input type="text" placeholder="Date (e.g., Jun 2026)" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={date} onChange={(e) => setDate(e.target.value)} required />
              
              <div className="w-full min-h-[44px] flex items-center bg-muted/60 rounded-xl border border-border px-3">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="text-xs w-full file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-primary file:text-white file:border-0 cursor-pointer font-bold" required={!image_url} />
              </div>
              
              <textarea placeholder="Description" className="w-full p-3 rounded-xl bg-muted/60 border border-border h-24 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {imageUploading && (
              <p className="text-xs text-muted-foreground animate-pulse">Uploading asset to cloud registry streams...</p>
            )}

            {image_url && !imageUploading && (
              <div className="relative w-20 h-20 group">
                <img src={image_url} className="w-20 h-20 object-cover rounded-lg border border-border shadow-sm" alt="Preview" />
                <button type="button" onClick={() => { setImage_url(''); setPublicId(''); if(fileInputRef.current) fileInputRef.current.value='' }} className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-0.5 shadow hover:scale-105 transition-transform">
                  <RxCross2 className="text-xs" />
                </button>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" disabled={formSubmitting || imageUploading} className="w-full sm:flex-1 bg-primary text-white p-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm shadow-sm">
                {formSubmitting ? 'Saving changes...' : editingId ? 'Update Certificate' : 'Publish Certificate'}
              </button>
              <button type="button" onClick={() => { clearForm(); setView('list'); }} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-muted font-bold hover:bg-muted/80 transition-colors text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* CONTROLLED DELETION DIALOG MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-3xl shadow-2xl max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold tracking-tight">Delete Certificate?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">This action will remove the certificate collection document and its cloud storage asset permanently.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-3 rounded-xl bg-muted font-bold hover:bg-muted/80 transition-colors text-sm">Cancel</button>
              <button onClick={async () => { 
                const cert = certs.find(c => c.id === deleteId); 
                if (cert) { 
                  await deleteCertificate(cert.id, cert.publicId); 
                  setDeleteId(null); 
                  fetchCerts(); 
                } 
              }} className="flex-1 px-4 py-3 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/90 transition-colors text-sm shadow-sm">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}