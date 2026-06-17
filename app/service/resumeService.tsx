'use server'

import dbConnect from '../lib/mongodb'
import { Resume } from '../lib/model'
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

/**
 * 1. Fetch all resumes ordered by latest additions first
 */
export async function getResumes() {
  try {
    await dbConnect()
    
    // Cast to any to bypass Mongoose generic query typing restrictions in Next.js
    const resumeModel = Resume as any
    const resumes = await resumeModel.find({}).sort({ createdAt: -1 }).lean()
    
    return { success: true, data: JSON.parse(JSON.stringify(resumes)) }
  } catch (error: any) {
    console.error("Error inside getResumes Server Action:", error)
    return { success: false, error: error.message || 'Failed to fetch resumes' }
  }
}

/**
 * 2. Upload incoming PDF details and record to Atlas
 */
export interface AddResumeInput {
  title: string;
  file: {
    url: string;      // Cloudinary secure_url
    publicId: string; // Cloudinary public_id
  };
}

export async function addResume(data: AddResumeInput) {
  try {
    await checkAuth()
    await dbConnect()

    const newResume = new Resume({
      title: data.title,
      file: {
        url: data.file.url,
        publicId: data.file.publicId
      },
      isActive: false // Defaults to inactive until toggled live
    })

    await newResume.save()
    revalidatePath('/') 
    return { success: true }
  } catch (err: any) {
    console.error("Error inside addResume Server Action:", err)
    return { success: false, error: err.message }
  }
}

/**
 * 3. Switches which resume is live on the public landing site
 */
export async function activateResume(id: string) {
  try {
    await checkAuth()
    await dbConnect()

    const resumeModel = Resume as any
    
    // Deactivate all options first
    await resumeModel.updateMany({}, { $set: { isActive: false } })
    
    // Set the selected resume to live
    await resumeModel.findByIdAndUpdate(id, { $set: { isActive: true } })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("Error inside activateResume Server Action:", error)
    return { success: false, error: error.message }
  }
}

/**
 * 4. Delete matching asset cleanly from cloud storage and MongoDB collections
 */
export async function deleteResume(id: string, publicId: string) {
  try {
    await checkAuth()
    await dbConnect()

    // 1. Clear file out of Cloudinary using 'raw' mode since PDFs aren't images
    await deleteFile(publicId, 'raw')

    // 2. Erase database reference cleanly using the casted model
    const resumeModel = Resume as any
    await resumeModel.findByIdAndDelete(id)

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("Error inside deleteResume Server Action:", error)
    return { success: false, error: error.message }
  }
}