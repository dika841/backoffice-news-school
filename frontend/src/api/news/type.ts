export type TNewsParams = {
  search?: string
  page?: number
  limit?: number
  category?: string
  sort?: string
  author?: string
}

export type TNewsResponse = {
  page: number
  limit: number
  total: number
  data: TNews[]
}

export type TNews = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  author_id: string
  is_published?: number
  published_at?: string
  created_at?: string
  updated_at?: string
  publishedDate: string
  author_username: string
}
