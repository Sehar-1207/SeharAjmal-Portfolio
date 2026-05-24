'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { getResumes, addResume, deleteResume } from '../../service/resumeService'
import { Resume } from './typeResume'
import { 
  RxTrash, 
  RxFileText, 
  RxUpload, 
  RxPlus 
} from 'react-icons/rx'

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  // Admin Form Field States
  const [file, setFile] = useState<File | null>(null)
  
  // Interface state flags
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchResumes = async () => {
    setLoading(true)
    const { data, error } = await getResumes()
    if (error) console.error('Error fetching resumes:', error.message)
    else setResumes(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchResumes()
    
    // Realtime subscription matching project synchronization patterns
    const channel = supabase
      .channel('resumes-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resumes' }, () => {
        fetchResumes()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert('Please select a resume file first.')
      return
    }

    setFormSubmitting(true)
    const { error } = await addResume(file)
    setFormSubmitting(false)

    if (error) {
      alert(`Error uploading resume: ${error.message}`)
    } else {
      clearForm()
      fetchResumes()
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const { error } = await deleteResume(deleteTarget.id!, deleteTarget.file_url)
    if (error) alert(`Error deleting resume: ${error.message}`)
    else fetchResumes()
    setDeleteTarget(null)
  }

  const clearForm = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-8 text-foreground px-4 md:px-0 max-w-7xl mx-auto py-10">
      
      {/* DELETE DIALOG MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xl max-w-sm w-full space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold">Delete Resume?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{deleteTarget.file_name}</strong>? 
              This action cannot be undone and will permanently drop the asset from cloud storage bucket partitions.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl bg-muted font-bold text-sm hover:bg-muted/80">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm hover:opacity-90">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER ROW */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Manage Resumes</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload, track, or manage active application resumes.</p>
      </div>

      {/* ACTIONS FORM GRID */}
      <form onSubmit={handleSubmit} className="bg-card p-4 md:p-6 rounded-2xl flex flex-col gap-4 border border-border shadow-sm">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <RxPlus className="h-5 w-5" /> Add New Resume
        </h2>
        
        <div className="w-full">
          <label className="text-xs text-muted-foreground font-semibold px-1">Resume File (PDF preferred)</label>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="w-full mt-1.5 p-2 rounded-xl bg-muted/60 border border-border text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-primary file:text-primary-foreground cursor-pointer" 
            required
          />
        </div>

        {file && (
          <div className="p-4 bg-muted/40 border border-border rounded-xl flex items-center gap-3">
            <RxFileText className="h-8 w-8 text-violet-500 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-zinc-200">{file.name}</p>
              <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to sync</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          {file && <button type="button" onClick={clearForm} className="px-5 py-3 rounded-xl bg-muted font-bold text-sm hover:bg-muted/80">Cancel</button>}
          <button 
            type="submit" 
            disabled={formSubmitting || !file} 
            className="flex-1 md:flex-none bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {formSubmitting ? (
              <><RxUpload className="animate-spin h-4 w-4" /> Saving...</>
            ) : (
              'Publish Resume'
            )}
          </button>
        </div>
      </form>

      {/* DATA VIEW CARDS GRID */}
      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading file assets...</div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-2xl text-sm text-muted-foreground">No resumes uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm hover:border-primary/20 transition-all">
              <div className="relative h-32 w-full bg-muted/40 flex items-center justify-center border-b border-border/40">
                <RxFileText className="h-12 w-12 text-muted-foreground/30" />
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-background/90 text-primary border border-border">
                  {r.file_url.split('.').pop()?.toUpperCase() || 'DOC'}
                </span>
              </div>
              
              <div className="p-5 flex-1 space-y-1">
                <h3 className="font-bold text-sm leading-tight line-clamp-2 text-zinc-200" title={r.file_name}>
                  {r.file_name}
                </h3>
                {r.created_at && (
                  <p className="text-[11px] text-muted-foreground">
                    Uploaded: {new Date(r.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                )}
              </div>
              
              <div className="p-5 pt-0 mt-2">
                <div className="flex gap-2.5 pt-3 border-t border-border/40">
                  <a 
                    href={r.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 py-2.5 rounded-xl text-xs font-bold text-center transition"
                  >
                    View File
                  </a>
                  <button 
                    onClick={() => setDeleteTarget(r)} 
                    className="flex-1 flex items-center justify-center gap-1.5 bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground text-destructive py-2.5 rounded-xl text-xs font-bold transition"
                  >
                    <RxTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}