'use server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
}

export async function uploadFile(formData: FormData): Promise<CloudinaryUploadResponse> {
  try {
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided for upload.')
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',  
          resource_type: 'auto', 
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    }
  } catch (error: any) {
    console.error('Cloudinary Upload Action Error:', error)
    throw new Error(`Upload configuration failed: ${error.message}`)
  }
}

export async function deleteFile(publicId: string, resourceType: 'image' | 'raw' = 'image'): Promise<any> {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error: any) {
    console.error('Cloudinary Delete Action Error:', error);
    throw new Error(`Failed to delete asset: ${error.message}`);
  }
}