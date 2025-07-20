import { z } from 'zod'

export const userSchema = z.object({
  username: z
    .string({ error: 'Username Tidak Boleh Kosong' })
    .nonempty({ message: 'Username tidak boleh kosong' }),

  email: z
    .email({ message: 'Format email tidak valid' })
    .nonempty({ message: 'Email tidak boleh kosong' }),

  password: z
    .string()
    .nonempty({ message: 'Password tidak boleh kosong' })
    .min(8, { message: 'Password minimal 8 karakter' }),

  role: z.string().nonempty({ message: 'Role tidak boleh kosong' }),
})

export type TUserSchema = z.infer<typeof userSchema>

export const userUpdateSchema = z.object({
  username: z.string().optional(),
  email: z.email().optional(),
  password: z.string().optional(),
  role: z.string().optional(),
})

export type TUserUpdateSchema = z.infer<typeof userUpdateSchema>
