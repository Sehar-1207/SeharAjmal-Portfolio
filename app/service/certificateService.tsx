'use server'

import dbConnect from '@/app/lib/mongodb'
import { Certification } from '@/app/lib/model'
import { deleteFile } from '@/app/lib/uploadImage'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// Authorization Helper
async function checkAuth() {
  const cookieStore = await cookies()
  if (!cookieStore.has('admin_session')) {
    throw new Error('Unauthorized access.')
  }
}

// 1. FETCH ALL CERTIFICATES
export async function getCertificates() {
  try {
    await dbConnect()
    
    // Cast to any safely prevents the parameter 'find' type assignment errors
    const certModel = Certification as any
    const certificates = await certModel.find({}).sort({ createdAt: -1 }).lean().exec()
    
    return { success: true, data: JSON.parse(JSON.stringify(certificates)) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch certificates' }
  }
}

// 2. ADD A NEW CERTIFICATE
export interface AddCertificateInput {
  title: string;
  issuer: string;
  issueDate?: string;
  description?: string;
  image: { url: string; publicId: string };
}

export async function addCertificate(data: AddCertificateInput) {
  try {
    await checkAuth()
    await dbConnect()

    const newCert = new Certification({
      title: data.title,
      issuer: data.issuer,
      issueDate: data.issueDate || "",
      description: data.description || "",
      image: {
        url: data.image.url,
        publicId: data.image.publicId,
      }
    })

    await newCert.save()
    revalidatePath('/') 
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 3. UPDATE AN EXISTING CERTIFICATE
export async function updateCertificate(id: string, data: Partial<AddCertificateInput>) {
  try {
    await checkAuth()
    await dbConnect()

    // FIX: Using an explicit cast bypasses the "This expression is not callable" union block error
    const certModel = Certification as any
    await certModel.findByIdAndUpdate(
      id, 
      { $set: data },
      { new: true }
    ).exec()
    
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 4. DELETE A CERTIFICATE
export async function deleteCertificate(id: string, publicId: string) {
  try {
    await checkAuth()
    await dbConnect()

    await deleteFile(publicId, 'image')

    const certModel = Certification as any
    await certModel.findByIdAndDelete(id).exec()

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}