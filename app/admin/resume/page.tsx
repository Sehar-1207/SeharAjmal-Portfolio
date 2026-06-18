'use client'

import { useEffect, useState, useRef } from 'react'
import { getResumes, addResume, deleteResume } from '@/app/service/resumeService'
import { uploadFile } from '@/app/lib/cloudinary'
import { Resume } from './typeResume'
import { 
  RxTrash, 
  RxFileText, 
  RxUpload, 
  RxPlus,
  RxCross2,
  RxCheckCircled,
  RxInfoCircled
} from 'react-icons/rx'

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  // Admin Form Field States
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Interface state flags
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchResumes = async () => {
    setLoading(true)
    const res = await getResumes()

    if (res.success && Array.isArray(res.data)) {
      setResumes(res.data)
    } else {
      console.error('Error fetching resumes:', res.error)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    const allowedTypes = ['.pdf', '.doc', '.docx']
    const isAllowed = allowedTypes.some(ext => droppedFile.name.toLowerCase().endsWith(ext))
    
    if (!isAllowed) {
      alert('Invalid file format. Please upload a PDF, DOC, or DOCX document.')
      return
    }
    setFile(droppedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert('Please select a resume file first.')
      return
    }

    setFormSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadResult = await uploadFile(formData)

      if (!uploadResult.success || !uploadResult.data) {
        alert(uploadResult.error || 'Upload failed')
        return
      }

      const result = await addResume({
        title: file.name,
        file: {
          url: uploadResult.data.url,
          publicId: uploadResult.data.publicId,
        },
      })

      if (!result.success) {
        alert(`Error uploading resume: ${result.error}`)
      } else {
        clearForm()
        fetchResumes()
      }
    } catch (err: any) {
      alert(err.message || 'Something went wrong')
    } finally {
      setFormSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    try {
      const result = await deleteResume(deleteTarget.id, deleteTarget.public_id)

      if (!result.success) {
        alert(`Error deleting resume: ${result.error}`)
      } else {
        fetchResumes()
      }
    } catch (err: any) {
      alert(err.message || 'Delete failed')
    } finally {
      setDeleteTarget(null)
    }
  }

  const clearForm = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 box-border overflow-x-hidden">
      
      {/* ACTION DIALOG MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-2 rounded-xl bg-destructive/10 shrink-0">
                <RxTrash className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">Remove Document Entry</h3>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed break-words">
              Are you sure you want to delete <strong className="text-foreground">{deleteTarget.file_name}</strong>? 
              This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button 
                type="button"
                onClick={() => setDeleteTarget(null)} 
                className="w-full order-2 sm:order-1 py-2.5 rounded-xl bg-muted font-bold text-sm hover:bg-muted/80 transition-all text-foreground"
              >
                Keep File
              </button>
              <button 
                type="button"
                onClick={confirmDelete} 
                className="w-full order-1 sm:order-2 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm hover:opacity-95 transition-all shadow-sm"
              >
                Confirm Destruction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Manage Resumes
          </h1>
          <p className="text-sm text-muted-foreground">
            Store, preview, and update application documentation asset layers.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40 text-[11px] font-medium text-muted-foreground self-start sm:self-auto shrink-0">
          <RxInfoCircled className="text-primary text-xs" /> Total Loaded: {resumes.length}
        </div>
      </div>

      {/* DROPZONE ACCORDION/CONTAINER */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm w-full box-border">
        <div className="p-4 sm:p-5 border-b border-border/40 bg-muted/20 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 truncate">
            <RxPlus className="text-primary text-base shrink-0" /> Upload New Repository Asset
          </h2>
          {file && (
            <button 
              type="button" 
              onClick={clearForm}
              className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <RxCross2 /> Clear
            </button>
          )}
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed transition-all p-6 sm:p-8 flex flex-col items-center justify-center text-center group cursor-pointer w-full box-border min-h-[160px] ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : file 
                  ? 'border-emerald-500/40 bg-emerald-500/[0.02]' 
                  : 'border-border hover:border-primary/40 hover:bg-muted/30'
            }`}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              disabled={formSubmitting}
              className="sr-only"
            />

            {file ? (
              <div className="space-y-3 animate-in fade-in duration-200 w-full max-w-xs sm:max-w-md">
                <div className="mx-auto p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit">
                  <RxCheckCircled className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div className="space-y-1 overflow-hidden w-full">
                  <p className="text-xs sm:text-sm font-bold truncate px-2 text-foreground">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to Sync
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto p-3 rounded-xl bg-muted border border-border text-muted-foreground group-hover:text-primary transition-all w-fit">
                  <RxUpload className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="space-y-1 px-1">
                  <p className="text-xs sm:text-sm font-semibold">
                    Drag & drop file here, or <span className="text-primary font-bold">browse</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-[240px] sm:max-w-xs mx-auto">
                    Supports PDF, DOC, or DOCX formats up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <button 
              type="submit" 
              disabled={formSubmitting || !file} 
              className="w-full sm:w-auto bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:pointer-events-none hover:opacity-90 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm"
            >
              {formSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Resume'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* CARDS RENDERING LIST */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-card border border-border rounded-2xl h-56 animate-pulse" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12 bg-card border border-dashed border-border rounded-2xl max-w-md mx-auto space-y-3 px-4 box-border">
          <div className="mx-auto p-3 rounded-xl bg-muted border border-border w-fit text-muted-foreground">
            <RxFileText className="h-5 w-5" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground">No records initialized</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full box-border">
          {resumes.map((r) => {
            const fileExtension = r.file_url.split('.').pop()?.toUpperCase() || 'PDF';
            
            return (
              <div 
                key={r.id} 
                className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all group w-full box-border"
              >
                <div className="relative h-24 sm:h-28 w-full bg-gradient-to-b from-muted/30 to-muted/10 flex items-center justify-between px-4 sm:px-5 border-b border-border/40 select-none">
                  <div className="p-2.5 rounded-xl bg-background border border-border/60 text-muted-foreground group-hover:text-primary transition-colors flex items-center justify-center">
                    <RxFileText className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {fileExtension}
                  </span>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4 overflow-hidden">
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm tracking-tight leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors break-words" title={r.file_name}>
                      {r.file_name}
                    </h3>
                    {r.created_at && (
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground/80 font-medium">
                        Synced {new Date(r.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t border-border/40 w-full">
                    <a 
                      href={r.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 flex items-center justify-center bg-muted hover:bg-muted/80 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-foreground transition-all border border-border/20"
                    >
                      View Resume
                    </a>
                    <button 
                      type="button"
                      onClick={() => setDeleteTarget(r)} 
                      className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground text-destructive transition-all flex items-center justify-center shrink-0"
                    >
                      <RxTrash className="text-xs sm:text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}