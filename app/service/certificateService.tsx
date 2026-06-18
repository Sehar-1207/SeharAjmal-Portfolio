'use server'

import dbConnect from '@/app/lib/mongodb'
import { Certification } from '@/app/models/certificates'
import { deleteFile } from '@/app/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// Authorization Helper
async function checkAuth() {
  const cookieStore = await cookies()
  if (!cookieStore.has('admin_session')) {
    throw new Error('Unauthorized access.')
  }
}

export async function getCertificates() {
  try {
    await dbConnect()
    
    const certModel = Certification as any
    const certificates = await certModel.find({}).sort({ order: 1, createdAt: -1 }).lean().exec()
    
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

    const certModel = Certification as any
    const count = await certModel.countDocuments()

    const newCert = new Certification({
      title: data.title,
      issuer: data.issuer,
      issueDate: data.issueDate || "",
      description: data.description || "",
      image: {
        url: data.image.url,
        publicId: data.image.publicId,
      },
      order: count 
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

    if (publicId) {
      await deleteFile(publicId, 'image')
    }

    const certModel = Certification as any
    await certModel.findByIdAndDelete(id).exec()

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

