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
  RxCheckCircled,
  RxRocket // Added to replace the static emoji header element
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

    return () => {
      supabase.removeChannel(channel)
    }
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

    const tagsArray = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '')

    const projectData = {
      title,
      desc,
      tags: tagsArray,
      img,
      repo,
      category,
    }

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

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project entry?')) return

    const { error } = await deleteProject(id)
    if (error) {
      alert(`Error deleting project: ${error.message}`)
    } else {
      fetchProjects()
    }
  }

  const clearForm = () => {
    setEditingId(null)
    setTitle('')
    setDesc('')
    setTagsInput('')
    setImg('')
    setRepo('')
    setCategory('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Manage Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Create, update, or remove live showcase items.</p>
      </div>

      {/* THEME-AWARE DATA MANAGEMENT FORM */}
      <form onSubmit={handleSubmit} className="bg-card text-card-foreground p-6 rounded-2xl flex flex-col gap-4 border border-border shadow-sm transition-colors duration-300">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          {editingId ? (
            <><span>📝</span> Edit Project Details</>
          ) : (
            <>
              <RxRocket className="h-5 w-5 text-primary animate-bounce-slow" /> 
              <span>Add New Project</span>
            </>
          )}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Project Title (e.g., Flutter Frontend)"
            className="p-2.5 rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Category (e.g., Frontend, Full Stack)"
            className="p-2.5 rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm transition"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          
          {/* Expanded Full-Width Image Selector Box Container */}
          <div className="flex flex-col gap-1.5 w-full md:col-span-1">
            <label className="text-xs text-muted-foreground font-semibold px-1">Project Cover Image</label>
            <div className="relative flex items-center justify-center w-full bg-muted/60 border border-border rounded-xl px-3 py-1.5 focus-within:border-primary transition group">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground hover:file:opacity-90 file:cursor-pointer cursor-pointer transition-all"
              />
            </div>
          </div>

          <input
            type="url"
            placeholder="GitHub Repository URL (repo)"
            className="p-2.5 rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm h-fit self-end w-full transition"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            required
          />
        </div>

        {/* IMAGE UPLOAD PROGRESS STATS */}
        {imageUploading && (
          <div className="flex items-center gap-2 text-xs text-amber-500 animate-pulse px-1">
            <RxUpload className="animate-spin" />
            <span>Streaming file payload to storage bucket...</span>
          </div>
        )}
        
        {img && !imageUploading && (
          <div className="mt-1 p-3 bg-muted/40 border border-border rounded-xl w-fit">
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium mb-2">
              <RxCheckCircled className="h-4 w-4" />
              <span>Asset uploaded securely</span>
            </div>
            <img src={img} alt="Preview" className="w-36 h-20 object-cover rounded-lg border border-border" />
          </div>
        )}

        <input
          type="text"
          placeholder="Tags separated by commas (e.g., Flutter, Dart, UI/UX)"
          className="p-2.5 rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm transition"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        <textarea
          placeholder="Project Description (desc)"
          rows={3}
          className="p-2.5 rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm transition resize-none"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />

        <div className="flex gap-3 justify-end pt-2">
          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              className="bg-muted text-muted-foreground text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-muted/80 hover:text-foreground transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={formSubmitting || imageUploading}
            className="bg-primary text-primary-foreground text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-40"
          >
            {formSubmitting ? 'Saving Entries...' : editingId ? 'Update Project' : 'Publish Project'}
          </button>
        </div>
      </form>

      <hr className="border-border/60" />
      
      {loading && <p className="text-sm text-muted-foreground animate-pulse">Loading portfolio records...</p>}
      {!loading && projects.length === 0 && <p className="text-sm text-muted-foreground">No matching rows active inside this schema bucket.</p>}

      {/* THEME-AWARE CARD DISPLAY MAP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-card text-card-foreground border border-border rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm hover:border-primary/20 transition-all duration-200">
            <div>
              {/* Card Image Display Block */}
              <div className="relative bg-muted/40 h-44 w-full border-b border-border/60 overflow-hidden flex items-center justify-center">
                {p.img ? (
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <RxLinkBreak2 className="h-6 w-6 text-muted-foreground/40" />
                )}
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-background/90 text-primary border border-border shadow-sm">
                  {p.category}
                </span>
              </div>
              
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-lg text-foreground tracking-tight line-clamp-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{p.desc}</p>
                
                {/* Dynamically Mapped Array Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {p.tags?.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-muted text-muted-foreground border border-border/40 font-medium px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Footer Drawer Panel */}
            <div className="p-5 pt-0 mt-2">
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 mb-4">
                  <span>🔗 Code Repository</span>
                </a>
              )}

              <div className="flex gap-2.5 pt-3 border-t border-border/40">
                <button
                  onClick={() => handleEditClick(p)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold py-2 rounded-xl transition border border-border/40"
                >
                  <RxPencil1 className="h-3.5 w-3.5 text-amber-500" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(p.id!)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground text-destructive text-xs font-bold py-2 rounded-xl transition border border-destructive/20"
                >
                  <RxTrash className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}