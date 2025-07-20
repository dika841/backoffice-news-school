import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string({ error: 'Nama Kategori Tidak Boleh Kosong' })
    .nonempty({ message: 'Nama Kategori Tidak Boleh Kosong' })
    .min(3, 'Minimal 3 Karakter'),
  description: z.string().optional(),
})

export type TCategorySchema = z.infer<typeof categorySchema>

export const categoryUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
})

export type TCategoryUpdateSchema = z.infer<typeof categoryUpdateSchema>
