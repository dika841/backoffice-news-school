import { Api } from '@/lib/axios/axios'
import type {
  TAnnouncementsParams,
  TAnnouncementsResponse,
  TAnnouncementsResponseOne,
  TRequestAnnouncement,
  TRequestAnnouncementUpdate,
} from './type'
import type { TResponse } from '@/common'

export const getAnnouncements = async (
  params: TAnnouncementsParams,
): Promise<TResponse<TAnnouncementsResponse>> => {
  const response = await Api.get('/announcements', { params })
  return response.data
}

export const getAnnouncementsBySlug = async (
  slug: string,
): Promise<TAnnouncementsResponseOne> => {
  const response = await Api.get(`/announcements/${slug}`)
  return response.data
}

export const deleteAnnouncements = async (id: string) => {
  const response = await Api.delete(`/announcements/${id}`)
  return response.data
}

export const updateAnnouncements = async (
  id: string,
  payload: TRequestAnnouncementUpdate,
) => {
  const response = await Api.put(`/announcements/${id}`, payload)
  return response.data
}

export const createAnnouncements = async (payload: TRequestAnnouncement) => {
  const response = await Api.post('/announcements', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
