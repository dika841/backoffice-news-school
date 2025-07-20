import { z } from 'zod'

export const newsFormSchema = z.object({
  title: z
    .string({ error: 'Judul harus diisi' })
    .min(1, 'Judul harus diisi')
    .max(100, 'Judul maksimal 100 karakter'),

  category_id: z.string().min(1, 'Kategori harus dipilih').optional(),
  excerpt: z
    .string({ error: 'Ringkasan harus diisi' })
    .min(1, 'Ringkasan harus diisi')
    .max(200, 'Ringkasan maksimal 200 karakter'),

  featured_image: z
    .any()
    .refine(
      (file) => file instanceof File || typeof file === 'string',
      'Gambar utama harus diunggah',
    )
    .refine(
      (file) => typeof file === 'string' || file.size <= 5 * 1024 * 1024,
      'Ukuran gambar maksimal 5MB',
    )
    .refine(
      (file) =>
        typeof file === 'string' ||
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Format gambar harus JPEG, PNG, atau WebP',
    ),

  content: z
    .string({ error: 'Konten harus diisi' })
    .min(1, 'Konten harus diisi')
    .refine(
      (content) => content.replace(/<[^>]*>?/gm, '').trim().length > 0,
      'Konten tidak boleh kosong',
    ),
})

// Type inference
export type TNewsFormValues = z.infer<typeof newsFormSchema>
