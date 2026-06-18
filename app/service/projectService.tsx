'use server'

import dbConnect from '@/app/lib/mongodb'
import { ProjectModel } from '@/app/models/projects'
import { deleteFile } from '@/app/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

async function checkAuth() {
  const cookieStore = await cookies()
  if (!cookieStore.has('admin_session')) {
    throw new Error('Unauthorized access.')
  }
}

// ---------------- FETCH ----------------
export async function getProjects() {
  try {
    await dbConnect()
    const projects = await ProjectModel.find().sort({ order: 1 }).lean()
    return { success: true, data: JSON.parse(JSON.stringify(projects)), error: null }
  } catch (error: any) {
    return { success: false, data: null, error: error.message || 'Failed to fetch projects' }
  }
}

// ---------------- ADD ----------------
export interface AddProjectInput {
  title: string
  description: string
  category: "frontend" | "backend" | "automation" | "app-development"
  image: { url: string; publicId: string }
  projectLink?: string
  githubLink?: string
  tags: string[]
}

export async function addProject(data: AddProjectInput) {
  try {
    await checkAuth()
    await dbConnect()

    const highestOrderProject = await ProjectModel.findOne().sort({ order: -1 }).lean()
    const nextOrder = highestOrderProject ? (highestOrderProject as any).order + 1 : 0

    await ProjectModel.create({ ...data, order: nextOrder })

    revalidatePath('/')
    revalidatePath('/admin/projects')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('addProject error:', error)
    return { success: false, error: error.message || 'Failed to add project' }
  }
}

// ---------------- UPDATE ----------------
export async function updateProject(id: string, data: Partial<AddProjectInput>) {
  try {
    await checkAuth()
    await dbConnect()
    await ProjectModel.findByIdAndUpdate(id, { $set: data })
    revalidatePath('/')
    revalidatePath('/admin/projects')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('updateProject error:', error)
    return { success: false, error: error.message || 'Failed to update project' }
  }
}

// ---------------- REORDER ----------------
export async function reorderProjects(orderedIds: string[]) {
  try {
    await checkAuth()
    await dbConnect()

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }))

    await ProjectModel.bulkWrite(bulkOps)
    revalidatePath('/')
    revalidatePath('/admin/projects')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('reorderProjects error:', error)
    return { success: false, error: error.message || 'Failed to reorder projects' }
  }
}

// ---------------- DELETE ----------------
export async function deleteProject(id: string, publicId: string) {
  try {
    await checkAuth()
    await dbConnect()

    if (publicId) {
      const cloudResult = await deleteFile(publicId, 'image')
      if (!cloudResult.success) {
        console.warn('Cloudinary delete issue:', cloudResult.error)
      }
    }

    await ProjectModel.findByIdAndDelete(id)

    revalidatePath('/')
    revalidatePath('/admin/projects')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('deleteProject error:', error)
    return { success: false, error: error.message || 'Failed to delete project' }
  }
}