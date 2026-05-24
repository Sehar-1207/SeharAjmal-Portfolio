import { supabase } from '../lib/supabase'
import { Certificate } from '../admin/certificate/typeCertificate'

// Fetches certificates and maps database columns to your Certificate type
export async function getCertificates(): Promise<{ data: Certificate[] | null; error: any }> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { data: null, error }

  const mappedData: Certificate[] = (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    date: row.date,
    image_url: row.image_url,
    description: row.description || '', // Map description
    created_at: row.created_at
  }))

  return { data: mappedData, error: null }
}

// Adds a new certificate
export async function addCertificate(cert: Omit<Certificate, 'id' | 'created_at'>) {
  return await supabase
    .from('certificates')
    .insert([{
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      image_url: cert.image_url,
      description: cert.description // Include in insert
    }])
}

// Updates an existing certificate
export async function updateCertificate(id: string, updates: Partial<Certificate>) {
  const dbUpdates: any = {}
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.issuer !== undefined) dbUpdates.issuer = updates.issuer
  if (updates.date !== undefined) dbUpdates.date = updates.date
  if (updates.image_url !== undefined) dbUpdates.image_url = updates.image_url
  if (updates.description !== undefined) dbUpdates.description = updates.description // Include in update

  return await supabase
    .from('certificates')
    .update(dbUpdates)
    .eq('id', id)
}

export async function deleteCertificate(id: string, imageUrl: string) {
  // Debug the incoming URL
  console.log("Raw Image URL:", imageUrl);

  // Extract just the filename
  const fileName = imageUrl.split('/').pop();
  console.log("Attempting to delete filename:", fileName);

  if (fileName) {
    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .remove([fileName]); // Supabase expects an array of paths
      
    if (error) console.error("Supabase Storage Error:", error);
    else console.log("Storage delete successful:", data);
  }

  return await supabase.from('certificates').delete().eq('id', id);
}