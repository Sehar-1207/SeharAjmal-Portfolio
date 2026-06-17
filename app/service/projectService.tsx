'use server'

import dbConnect from '../lib/mongodb'
import { Project } from '../lib/model'
import { deleteFile } from '../lib/uploadImage'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// Authorization Helper
async function checkAuth() {
  const cookieStore = await cookies()
  if (!cookieStore.has('admin_session')) {
    throw new Error('Unauthorized access.')
  }
}

// 1. FETCH ALL PROJECTS (Sorted by drag-and-drop order)
export async function getProjects() {
  try {
    await dbConnect()
    
    // Cast to any to bypass Mongoose generic query parameter typing bugs
    const projectModel = Project as any
    const projects = await projectModel.find({}).sort({ order: 1 }).lean()
    
    return { success: true, data: JSON.parse(JSON.stringify(projects)) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch projects' }
  }
}

// 2. ADD NEW PROJECT
export interface AddProjectInput {
  title: string;
  description: string;
  category: "frontend" | "backend" | "automation" | "app-development";
  image: { url: string; publicId: string };
  projectLink?: string;
  githubLink?: string;
  tags: string[];
}

export async function addProject(data: AddProjectInput) {
  try {
    await checkAuth()
    await dbConnect()
    
    // Cast to any to allow clean chaining of .sort() and .lean() without error
    const projectModel = Project as any
    const highestOrderProject = await projectModel.findOne({}).sort({ order: -1 }).lean()
    const nextOrder = highestOrderProject ? highestOrderProject.order + 1 : 0

    const newProject = new Project({
      ...data,
      order: nextOrder
    })

    await newProject.save()
    revalidatePath('/') 
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 3. UPDATE AN EXISTING PROJECT
export async function updateProject(id: string, data: Partial<AddProjectInput>) {
  try {
    await checkAuth()
    await dbConnect()

    // Cast to any to fix the "This expression is not callable" union type error
    const projectModel = Project as any
    await projectModel.findByIdAndUpdate(id, { $set: data })
    
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 4. DRAG AND DROP REORDERING ACTIONS
export async function reorderProjects(orderedIds: string[]) {
  try {
    await checkAuth()
    await dbConnect()
    
    const projectModel = Project as any
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }))

    await projectModel.bulkWrite(bulkOps)
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 5. DELETE A PROJECT
export async function deleteProject(id: string, publicId: string) {
  try {
    await checkAuth()
    await dbConnect()
    
    await deleteFile(publicId, 'image')
    
    const projectModel = Project as any
    await projectModel.findByIdAndDelete(id)
    
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}