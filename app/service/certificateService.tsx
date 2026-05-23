import { supabase } from '../lib/supabase'
import { Certificate } from '../admin/certificate/typeCertificate'

export async function getCertificates() {
  return await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function addCertificate(cert: Certificate) {
  return await supabase.from('certificates').insert([cert])
}

export async function deleteCertificate(id: string) {
  return await supabase.from('certificates').delete().eq('id', id)
}