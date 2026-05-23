import { supabase } from '../lib/supabase'

export async function uploadImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('portfolio-images')
    .upload(fileName, file)

  if (error) {
    throw error
  }

  const { data: publicUrlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}