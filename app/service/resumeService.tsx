import { supabase } from '../lib/supabase';
import { Resume } from '../admin/resume/typeResume';

// 1. Fetch all resumes
export async function getResumes(): Promise<{ data: Resume[] | null; error: any }> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };

  const mappedData: Resume[] = (data || []).map((row: any) => ({
    id: row.id,
    file_name: row.file_name,
    file_url: row.file_url,
    created_at: row.created_at,
  }));

  return { data: mappedData, error: null };
}

// 2. Upload file to storage bucket and insert record into database
export async function addResume(file: File): Promise<{ error: any }> {
  try {
    const fileExt = file.name.split('.').pop();
    const uniqueFileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${uniqueFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('resumes')
      .insert([
        {
          file_name: file.name,
          file_url: publicUrl,
        },
      ]);

    if (dbError) throw dbError;

    return { error: null };
  } catch (err: any) {
    return { error: err };
  }
}

export async function deleteResume(id: string, fileUrl: string) {
  console.log("Raw File URL:", fileUrl);

  const urlParts = fileUrl.split('/resumes/');
  const filePath = urlParts[1];
  
  console.log("Attempting to delete storage path:", filePath);

  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from('resumes')
      .remove([filePath]);

    if (storageError) {
      console.error("Supabase Storage Error:", storageError);
    }
  }
  return await supabase.from('resumes').delete().eq('id', id);
}