import {
  createAnnouncements,
  deleteAnnouncements,
  updateAnnouncements,
} from '@/api/announcement/api'
import type {
  TRequestAnnouncement,
  TRequestAnnouncementUpdate,
} from '@/api/announcement/type'
import { useMutation } from '@tanstack/react-query'

export const useCreateAnnounMutation = () =>
  useMutation({
    mutationKey: ['create-announ'],
    mutationFn: async (payload: TRequestAnnouncement) =>
      createAnnouncements(payload),
  })

export const useDeleteAnnounMutation = () =>
  useMutation({
    mutationKey: ['delete-announ'],
    mutationFn: async (id: string) => deleteAnnouncements(id),
  })

export const useUpdateAnnounMutation = (id: string) =>
  useMutation({
    mutationKey: ['update-announ', id],
    mutationFn: async (payload: TRequestAnnouncementUpdate) =>
      updateAnnouncements(id, payload),
  })
