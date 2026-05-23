export type Project = {
  id?: string
  title: string
  desc: string        // Short description matching your JSON
  tags: string[]      // String array matching ["Flutter", "Dart", "UI/UX"]
  img: string         // Handled as the uploaded asset destination path
  repo: string        // GitHub link
  category: string    // e.g., 'Frontend'
  created_at?: string
}