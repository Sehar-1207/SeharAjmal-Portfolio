'use client'

import { useEffect, useState, useRef } from 'react'
import { getProjects, addProject, updateProject, deleteProject, reorderProjects } from '@/app/service/projectService'
import { uploadFile } from '@/app/lib/cloudinary'
import { Project } from './typeProject'
import {
  RxPencil1,
  RxTrash,
  RxLinkBreak2,
  RxUpload,
  RxRocket,
  RxPlus,
  RxCross2,
  RxDragHandleDots2,
  RxArrowLeft
} from 'react-icons/rx'

const CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'full-stack', label: 'Full Stack' },
  { value: 'automation', label: 'Automation' },
  { value: 'app-development', label: 'App Development' },
]

type PageView = 'list' | 'form';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<PageView>('list')

  // Core Form Input Field States
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [img, setImg] = useState('')
  const [imgPublicId, setImgPublicId] = useState('')
  const [repo, setRepo] = useState('')
  const [projectLink, setProjectLink] = useState('')
  const [category, setCategory] = useState('')

  // Interface state flags
  const [imageUploading, setImageUploading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  // Drag-and-drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [reordering, setReordering] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProjects = async () => {
    setLoading(true)
    const res = await getProjects()

    if (res.success && Array.isArray(res.data)) {
      const mappedProjects: Project[] = res.data.map((p: any) => ({
        id: p._id || p.id,
        title: p.title,
        desc: p.description || p.desc || '',
        tags: p.tags || [],
        img: p.image?.url || p.img || '',
        publicId: p.image?.publicId || '',
        repo: p.githubLink || p.repo || '',
        projectLink: p.projectLink || '',
        category: p.category || '',
        order: p.order ?? 0,
      }))
      mappedProjects.sort((a, b) => a.order - b.order)
      setProjects(mappedProjects)
    } else {
      console.error('Error fetching projects:', res.error)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setImageUploading(true)
      const uploadData = new FormData()
      uploadData.append('file', file)

      const uploadResult = await uploadFile(uploadData)

      if (!uploadResult.success || !uploadResult.data) {
        alert(uploadResult.error || 'Image upload failed')
        return
      }

      setImg(uploadResult.data.url)
      setImgPublicId(uploadResult.data.publicId)
    } catch (error: any) {
      alert(`Image upload failed: ${error.message || error}`)
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!img || !imgPublicId) {
      alert('Please select and upload a cover image first.')
      return
    }

    setFormSubmitting(true)
    const tagsArray = tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean)

    const projectPayload = {
      title,
      description: desc,
      tags: tagsArray,
      image: {
        url: img,
        publicId: imgPublicId,
      },
      githubLink: repo,
      projectLink: projectLink || '',
      category: category as any,
    }

    const result = editingId
      ? await updateProject(editingId, projectPayload)
      : await addProject(projectPayload)

    setFormSubmitting(false)

    if (!result.success) {
      alert(`Error saving project: ${result.error}`)
    } else {
      clearForm()
      setView('list')
      fetchProjects()
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const result = await deleteProject(deleteTarget.id!, deleteTarget.publicId || '')

    if (!result.success) {
      alert(`Error deleting project: ${result.error}`)
    } else {
      fetchProjects()
    }
    setDeleteTarget(null)
  }

  const handleAddClick = () => {
    clearForm()
    setView('form')
  }

  const handleEditClick = (project: Project) => {
    setEditingId(project.id || null)
    setTitle(project.title)
    setDesc(project.desc)
    setTagsInput(project.tags ? project.tags.join(', ') : '')
    setImg(project.img)
    setImgPublicId(project.publicId || '')
    setRepo(project.repo)
    setProjectLink(project.projectLink || '')
    setCategory(project.category)
    setView('form')
  }

  const clearForm = () => {
    setEditingId(null)
    setTitle(''); setDesc(''); setTagsInput('')
    setImg(''); setImgPublicId('')
    setRepo(''); setProjectLink(''); setCategory('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ---------------- DRAG AND DROP REORDERING ----------------
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    setProjects((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(draggedIndex, 1)
      updated.splice(index, 0, moved)
      return updated
    })
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    setDraggedIndex(null)
    setReordering(true)

    const orderedIds = projects.map((p) => p.id).filter(Boolean) as string[]
    const result = await reorderProjects(orderedIds)

    if (!result.success) {
      alert(`Error saving new order: ${result.error}`)
      fetchProjects()
    }

    setReordering(false)
  }

  return (
    <div className="space-y-8 text-foreground px-4 md:px-0 max-w-7xl mx-auto py-10 min-h-screen bg-transparent">

      {/* GLOBAL DISMISS DELETION DIALOG MODAL */}
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

      {/* HEADER CONTROLS VIEW COMPONENT */}
      {view === 'list' && (
        <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Manage Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, edit, remove, or drag to reorder live showcase items.
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-xl hover:opacity-90 transition shadow-sm text-sm"
          >
            <RxPlus className="h-5 w-5" /> Add Project
          </button>
        </div>
      )}

      {/* REORDERING MATRIX STATE INDICATOR */}
      {view === 'list' && reordering && (
        <p className="text-xs text-amber-500 font-medium animate-pulse">Saving data node structural alignment configuration...</p>
      )}

      {/* ISOLATED LIST DISPLAY VIEW */}
      {view === 'list' && (
        <>
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground animate-pulse">Loading project gallery items...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl text-sm text-muted-foreground bg-transparent">
              No showcase entries recorded in database yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, index) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing relative select-none ${draggedIndex === index ? 'opacity-40 scale-[0.98]' : ''
                    }`}
                >
                  {/* CLEAN SCREENSHOT RENDER CONTAINER */}
                  <div className="relative h-48 w-full bg-white overflow-hidden border-b border-border/40 flex items-center justify-center p-3">
                    {p.img ? (
                      <img 
                        src={p.img} 
                        alt={p.title} 
                        className="max-w-full max-h-full object-contain rounded-md pointer-events-none shadow-sm border border-neutral-100" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted/20 w-full">
                        <RxLinkBreak2 className="text-muted-foreground/40 h-6 w-6" />
                      </div>
                    )}

                    <span className="absolute top-3 left-3 p-1.5 rounded-lg bg-background/90 border border-border text-muted-foreground shadow-sm">
                      <RxDragHandleDots2 className="h-4 w-4" />
                    </span>

                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-background/90 text-primary border border-border shadow-sm">
                      {CATEGORIES.find((c) => c.value === p.category)?.label || p.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 space-y-2">
                    <h3 className="font-bold text-base tracking-tight line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {p.tags?.map((tag, i) => (
                        <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-medium border border-border/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-2">
                    <div className="flex gap-2.5 pt-3 border-t border-border/40">
                      <button onClick={() => handleEditClick(p)} className="flex-1 flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 py-2.5 rounded-xl text-xs font-bold transition">
                        <RxPencil1 className="text-amber-500" /> Edit
                      </button>
                      <button onClick={() => setDeleteTarget(p)} className="flex-1 flex items-center justify-center gap-1.5 bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground text-destructive py-2.5 rounded-xl text-xs font-bold transition">
                        <RxTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ISOLATED NEW PAGE REPLACEMENT FORM workspace VIEW */}
      {view === 'form' && (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-200">

          <button
            type="button"
            onClick={() => { clearForm(); setView('list'); }}
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <RxArrowLeft className="text-base" /> Back to Gallery View
          </button>

          <form onSubmit={handleSubmit} className="bg-card p-5 md:p-6 rounded-2xl border border-border space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                {editingId ? <><RxPencil1 className="h-5 w-5 text-amber-500" /> Edit Project Entry</> : <><RxRocket className="h-5 w-5" /> Add New Showcase Project</>}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground px-1">Project Title</label>
                <input type="text" placeholder="e.g., E-Commerce Hub" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground px-1">Project Category</label>
                <select
                  className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>Select category classification</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground px-1">GitHub Repository URL</label>
                <input type="url" placeholder="https://github.com/..." className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={repo} onChange={(e) => setRepo(e.target.value)} required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground px-1">Live Project URL <span className="text-muted-foreground/60 font-normal">(Optional)</span></label>
                <input type="url" placeholder="https://yourdomain.com" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-bold px-1">Cover Showcase Banner Asset</label>
              <div className="w-full min-h-[44px] flex items-center bg-muted/60 rounded-xl border border-border px-3 py-1.5">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} disabled={imageUploading} className="text-xs w-full file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-primary file:text-primary-foreground file:border-0 cursor-pointer font-bold disabled:opacity-50" />
              </div>
            </div>

            {(imageUploading || img) && (
              <div className="p-3 bg-muted/40 border border-border rounded-xl">
                {imageUploading ? (
                  <div className="flex items-center gap-2 text-xs text-amber-500 py-4 justify-center font-medium">
                    <RxUpload className="animate-spin text-base" /> Uploading asset streams to Cloudinary...
                  </div>
                ) : (
                  /* MATCHED CLEAN FORM PREVIEW BLOCK */
                  <div className="relative group rounded-lg overflow-hidden border border-border bg-white flex items-center justify-center p-3 h-44">
                    <img src={img} alt="Preview Matrix" className="max-w-full max-h-full object-contain rounded-md shadow-sm border border-neutral-100" />
                    <button
                      type="button"
                      onClick={() => { setImg(''); setImgPublicId(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      className="absolute top-3 right-3 bg-destructive text-white rounded-full p-1.5 shadow-md hover:scale-105 transition-transform"
                    >
                      <RxCross2 className="text-sm" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground px-1">Frameworks / Tags <span className="text-muted-foreground/60 font-normal">(Comma Separated)</span></label>
              <input type="text" placeholder="Next.js, TypeScript, Tailwind CSS, Prisma" className="w-full min-h-[44px] p-3 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground px-1">Project Workspace Description</label>
              <textarea placeholder="Write a short overview describing the structural scope and core features of this build..." rows={4} className="w-full p-3 rounded-xl bg-muted/60 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed" value={desc} onChange={(e) => setDesc(e.target.value)} required />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-border/60">
              <button
                type="submit"
                disabled={formSubmitting || imageUploading}
                className="w-full sm:flex-1 bg-primary text-primary-foreground p-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 text-sm shadow-sm"
              >
                {formSubmitting ? 'Saving changes...' : editingId ? 'Update Project' : 'Publish Project'}
              </button>
              <button
                type="button"
                onClick={() => { clearForm(); setView('list'); }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-muted font-bold hover:bg-muted/80 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}