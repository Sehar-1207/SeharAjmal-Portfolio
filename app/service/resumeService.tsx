'use server'

import dbConnect from '@/app/lib/mongodb'
import { ResumeModel } from '@/app/models/resume'
import { deleteFile } from '@/app/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import type { Resume } from '@/app/admin/resume/typeResume'

// ---------------- AUTH ----------------
async function checkAuth() {
  const cookieStore = await cookies()

  if (!cookieStore.has('admin_session')) {
    throw new Error('Unauthorized access.')
  }
}

// ---------------- FETCH ----------------
export async function getResumes() {
  try {
    await dbConnect()

    const resumes = await ResumeModel.find().sort({ createdAt: -1 }).lean()

    const formatted: Resume[] = resumes.map((r: any) => ({
      id: r._id.toString(),
      file_name: r.title,
      file_url: r.file?.url,
      public_id: r.file?.publicId, // ✅ was missing — delete had nothing to work with
      created_at: r.createdAt?.toISOString(),
    }))

    return {
      success: true,
      data: formatted,
      error: null,
    }
  } catch (error: any) {
    console.error('getResumes error:', error)

    return {
      success: false,
      data: null,
      error: error.message || 'Failed to fetch resumes',
    }
  }
}

// ---------------- ADD ----------------
export interface AddResumeInput {
  title: string
  file: {
    url: string
    publicId: string
  }
}

export async function addResume(data: AddResumeInput) {
  try {
    await checkAuth()
    await dbConnect()

    await ResumeModel.create({
      title: data.title,
      file: {
        url: data.file.url,
        publicId: data.file.publicId,
      },
      isActive: false,
    })

    revalidatePath('/')
    revalidatePath('/admin/resume')

    return {
      success: true,
      error: null,
    }
  } catch (error: any) {
    console.error('addResume error:', error)

    return {
      success: false,
      error: error.message || 'Failed to add resume',
    }
  }
}

// ---------------- DELETE ----------------
export async function deleteResume(id: string, publicId: string) {
  try {
    await checkAuth()
    await dbConnect()

    if (publicId) {
      const cloudResult = await deleteFile(publicId, 'image')
      if (!cloudResult.success) {
        // Don't block the DB cleanup just because Cloudinary couldn't find the asset
        console.warn('Cloudinary delete issue:', cloudResult.error)
      }
    }

    await ResumeModel.findByIdAndDelete(id)

    revalidatePath('/')
    revalidatePath('/admin/resume')

    return {
      success: true, // ✅ was missing entirely before
      error: null,
    }
  } catch (error: any) {
    console.error('deleteResume error:', error)

    return {
      success: false,
      error: error.message || 'Failed to delete resume',
    }
  }
}