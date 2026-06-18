'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export interface CloudinaryUploadResponse {
  url: string
  publicId: string
}

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return {
        success: false,
        data: null,
        error: 'Invalid or missing file.',
      }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/resumes',
          // PDFs live under Cloudinary's "image" resource type
          // (it supports page-preview/transformations for PDFs).
          // Setting this explicitly keeps upload/delete in sync.
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )

      stream.end(buffer)
    })

    return {
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
      error: null,
    }
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error)

    return {
      success: false,
      data: null,
      error: error?.message || 'Upload failed.',
    }
  }
}

export async function deleteFile(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })

    return {
      success: result.result === 'ok' || result.result === 'not found',
      result,
      error: result.result === 'ok' ? null : `Cloudinary returned: ${result.result}`,
    }
  } catch (error: any) {
    console.error('Cloudinary Delete Error:', error)

    return {
      success: false,
      result: null,
      error: error?.message || 'Failed to delete file.',
    }
  }
}