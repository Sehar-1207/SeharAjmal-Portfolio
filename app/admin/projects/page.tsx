'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { getProjects, addProject, updateProject, deleteProject } from '../../service/projectService'
import { uploadImage } from '../../lib/uploadImage'
import { Project } from './typeProject'
import { 
  RxPencil1, 
  RxTrash, 
  RxLinkBreak2, 
  RxUpload, 
  RxRocket 
} from 'react-icons/rx' 

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Admin Form Field States
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [tagsInput, setTagsInput] = useState('') 
  const [img, setImg] = useState('')
  const [repo, setRepo] = useState('')
  const [category, setCategory] = useState('')
  
  // Interface state flags
  const [imageUploading, setImageUploading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await getProjects()
    if (error) console.error('Error fetching projects:', error.message)
    else setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
    const channel = supabase
      .channel('projects-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setImageUploading(true)
      const uploadedUrl = await uploadImage(file)
      setImg(uploadedUrl) 
    } catch (error: any) {
      alert(`Image upload failed: ${error.message || error}`)
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!img) {
      alert('Please select and upload a cover image file first.')
      return
    }
    setFormSubmitting(true)
    const tagsArray = tagsInput.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '')
    const projectData = { title, desc, tags: tagsArray, img, repo, category }

    let error;
    if (editingId) {
      const res = await updateProject(editingId, projectData)
      error = res.error
    } else {
      const res = await addProject(projectData)
      error = res.error
    }
    setFormSubmitting(false)
    if (error) {
      alert(`Error saving project data: ${error.message}`)
    } else {
      clearForm()
      fetchProjects()
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const { error } = await deleteProject(deleteTarget.id!, deleteTarget.img)
    if (error) alert(`Error deleting project: ${error.message}`)
    else fetchProjects()
    setDeleteTarget(null)
  }

  const handleEditClick = (project: Project) => {
    setEditingId(project.id || null)
    setTitle(project.title)
    setDesc(project.desc)
    setTagsInput(project.tags ? project.tags.join(', ') : '')
    setImg(project.img)
    setRepo(project.repo)
    setCategory(project.category)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearForm = () => {
    setEditingId(null)
    setTitle(''); setDesc(''); setTagsInput(''); setImg(''); setRepo(''); setCategory('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-8 text-foreground px-4 md:px-0 max-w-7xl mx-auto py-10">
      
      {/* DELETE DIALOG MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xl max-w-sm w-full space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold">Delete Project?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{deleteTarget.title}</strong>? 
              This action cannot be undone and will remove the associated image from storage.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl bg-muted font-bold text-sm hover:bg-muted/80">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm hover:opacity-90">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black tracking-tight">Manage Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Create, update, or remove live showcase items.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-4 md:p-6 rounded-2xl flex flex-col gap-4 border border-border shadow-sm">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          {editingId ? '📝 Edit Project' : <><RxRocket className="h-5 w-5" /> Add New Project</>}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Project Title" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:border-primary outline-none" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Category" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:border-primary outline-none" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <input type="url" placeholder="GitHub Repository URL" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:border-primary outline-none md:col-span-2" value={repo} onChange={(e) => setRepo(e.target.value)} required />
        </div>

        <div className="w-full">
          <label className="text-xs text-muted-foreground font-semibold px-1">Cover Image</label>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="w-full mt-1.5 p-2 rounded-xl bg-muted/60 border border-border text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-primary file:text-primary-foreground cursor-pointer" />
        </div>

        {(imageUploading || img) && (
          <div className="p-3 bg-muted/40 border border-border rounded-xl">
            {imageUploading ? (
              <div className="flex items-center gap-2 text-xs text-amber-500"><RxUpload className="animate-spin" /> Uploading...</div>
            ) : (
              <img src={img} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
            )}
          </div>
        )}

        <input type="text" placeholder="Tags (comma separated)" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:border-primary outline-none" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
        <textarea placeholder="Project Description" rows={3} className="w-full p-3 rounded-xl bg-muted/60 border border-border text-sm focus:border-primary outline-none resize-none" value={desc} onChange={(e) => setDesc(e.target.value)} required />

        <div className="flex gap-3 justify-end pt-2">
          {editingId && <button type="button" onClick={clearForm} className="px-5 py-3 rounded-xl bg-muted font-bold text-sm hover:bg-muted/80">Cancel</button>}
          <button type="submit" disabled={formSubmitting || imageUploading} className="flex-1 md:flex-none bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl disabled:opacity-50">
            {formSubmitting ? 'Saving...' : editingId ? 'Update Project' : 'Publish Project'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm hover:border-primary/20 transition-all">
            <div className="relative h-48 w-full bg-muted overflow-hidden">
              {p.img ? <img src={p.img} alt={p.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><RxLinkBreak2 className="text-muted-foreground/40" /></div>}
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-background/90 text-primary border border-border">{p.category}</span>
            </div>
            <div className="p-5 flex-1 space-y-2">
              <h3 className="font-bold text-lg leading-tight line-clamp-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {p.tags?.map((tag, i) => <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{tag}</span>)}
              </div>
            </div>
            <div className="p-5 pt-0 mt-2">
              <div className="flex gap-2.5 pt-3 border-t border-border/40">
                <button onClick={() => handleEditClick(p)} className="flex-1 flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 py-2.5 rounded-xl text-xs font-bold transition"><RxPencil1 className="text-amber-500" /> Edit</button>
                <button onClick={() => setDeleteTarget(p)} className="flex-1 flex items-center justify-center gap-1.5 bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground text-destructive py-2.5 rounded-xl text-xs font-bold transition"><RxTrash /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}