import { supabase } from '../lib/supabase'
import { Project } from '../admin/projects/typeProject'

// Fetches database entries and converts them into your preferred object structure
export async function getProjects(): Promise<{ data: Project[] | null; error: any }> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { data: null, error }

  const mappedData: Project[] = (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    desc: row.description || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    img: row.image_url || '',
    repo: row.github_url || '',
    category: row.category || 'Frontend',
    created_at: row.created_at
  }))

  return { data: mappedData, error: null }
}

export async function addProject(project: Omit<Project, 'id' | 'created_at'>) {
  return await supabase
    .from('projects')
    .insert([{
      title: project.title,
      description: project.desc, // Maps your 'desc' to Supabase 'description'
      tags: project.tags,
      image_url: project.img,    // Maps your 'img' to Supabase 'image_url'
      github_url: project.repo,  // Maps your 'repo' to Supabase 'github_url'
      category: project.category
    }])
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const dbUpdates: any = {}
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.desc !== undefined) dbUpdates.description = updates.desc
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags
  if (updates.img !== undefined) dbUpdates.image_url = updates.img
  if (updates.repo !== undefined) dbUpdates.github_url = updates.repo
  if (updates.category !== undefined) dbUpdates.category = updates.category

  return await supabase
    .from('projects')
    .update(dbUpdates)
    .eq('id', id)
}

export async function deleteProject(id: string) {
  return await supabase
    .from('projects')
    .delete()
    .eq('id', id)
}