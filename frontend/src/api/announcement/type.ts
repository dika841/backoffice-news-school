export type TAnnouncement = {
  id: string
  title: string
  slug: string
  content: string
  author_id: string
  category_id: string
  is_important: boolean
  start_date: Date
  end_date: Date
  created_at: string
  updated_at: string
  featured_image: string
  author: string
  category_name: string
  category_slug: string
}
export type TAnnouncementsResponse = {
  page: number
  limit: number
  total: number
  data: TAnnouncement[]
}
export type TAnnouncementsResponseOne = {
  page: number
  limit: number
  total: number
  data: TAnnouncement
}
export type TRequestAnnouncement = {
  title: string
  content: string
  category_id: string
  is_important: number
  featured_image?: File
  start_date: string
  end_date: string
}
export type TRequestAnnouncementUpdate = {
  title: string
  content: string
  category_id: string
  is_important: number
  featured_image?: File
  start_date: string
  end_date: string
}

export type TAnnouncementsParams = {
  search?: string
  page?: number
  limit?: number
  author?: string
  sort?: string
  start?: string
  category?: string
}
