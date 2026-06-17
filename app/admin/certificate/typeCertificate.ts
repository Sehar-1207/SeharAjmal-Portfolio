export type Certificate = {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  image: {
    url: string
    publicId: string
  }
  created_at?: string
}