import { z } from 'zod'

export const AnnouncementInputSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  content: z.string().min(1, 'Konten tidak boleh kosong'),
  start_date: z.date({
    error: 'Tanggal mulai wajib diisi',
  }),
  end_date: z.date({
    error: 'Tanggal selesai wajib diisi',
  }),
  category_id: z.string().uuid('ID kategori tidak valid'),
  is_important: z.boolean().optional(),
  featured_image: z
    .any()
    .refine(
      (file) => typeof file === 'string' || file.size <= 5 * 1024 * 1024,
      'Ukuran gambar maksimal 5MB',
    )
    .refine(
      (file) =>
        typeof file === 'string' ||
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Format gambar harus JPEG, PNG, atau WebP',
    )
    .optional(),
})

export type TAnnouncements = z.infer<typeof AnnouncementInputSchema>
