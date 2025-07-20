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
export type TNewsResponseOne = {
  page: number
  limit: number
  total: number
  data: TNews
}
export type TNews = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  author_id: string
  category_id?: string
  is_published?: boolean
  published_at?: string
  created_at?: string
  updated_at?: string
  publishedDate: string
  author_username: string
}

export type TNewsRequest = {
  title: string
  content: string
  excerpt: string
  category_id: string
  featured_image: File
  is_published?: boolean
}
export type TNewsRequestUpdate = {
  title?: string
  content?: string
  excerpt?: string
  category_id?: string
  featured_image?: string
  is_published?: boolean
}
