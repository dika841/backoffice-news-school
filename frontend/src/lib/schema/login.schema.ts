import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string({ error: 'Username Tidak Boleh Kosong' }),
  password: z
    .string({ error: 'Password Tidak Boleh Kosong' })
    .min(8, { message: 'Password minimal 8 karakter' }),
})

export type TLogin = z.infer<typeof loginSchema>
