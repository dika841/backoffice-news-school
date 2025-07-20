import {
  getAnnouncements,
  getAnnouncementsBySlug,
} from '@/api/announcement/api'
import type { TAnnouncementsParams } from '@/api/announcement/type'
import { useQuery } from '@tanstack/react-query'

export const useGetAnnouncementsQuery = (params: TAnnouncementsParams) => {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: async () => await getAnnouncements(params),
    staleTime: 5000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  })
}

export const useGetAnnouncementsBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ['announcements', slug],
    queryFn: async () => await getAnnouncementsBySlug(slug),
  })
}
