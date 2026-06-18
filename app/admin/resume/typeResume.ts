export interface Resume {
  id: string
  file_name: string
  file_url: string
  public_id: string   // ✅ REQUIRED FIX
  created_at?: string
}