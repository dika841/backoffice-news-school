import type { TUserRequestUpdate, TUserResponseOne } from '@/api/users/type'
import { InputText } from '@/components/shared/input-text/Input-text'
import { SelectInput } from '@/components/shared/select-input/select-input'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useUpdateUserMutation } from '@/hooks/mutation/use-user-mutation/use-user-mutation'
import { useUserQueryById } from '@/hooks/query/use-user-query/use-user-query'
import {
  userUpdateSchema,
  type TUserUpdateSchema,
} from '@/lib/schema/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/users/edit/$userId')({
  component: () => {
    const { data } = useUserQueryById(Route.useParams().userId)

    return <EditUser data={data?.data ?? ({} as TUserResponseOne)} />
  },
})

function EditUser(data: TUserResponseOne) {
  const form = useForm<TUserUpdateSchema>({
    resolver: zodResolver(userUpdateSchema),
    mode: 'all',
    defaultValues: {
      username: data?.data?.username,
      email: data?.data?.email,
      role: data?.data?.role,
    },
  })

  const router = Route.useNavigate()
  const id = Route.useParams().userId
  const { mutate, isPending } = useUpdateUserMutation(id)
  const onSubmit = (data: TUserRequestUpdate) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Berhasil diperbarui', {
          position: 'top-right',
          richColors: true,
          description: 'Data pengguna berhasil diperbarui',
        })
        router({
          to: '/dashboard/users',
        })
      },
      onError: (err) => {
        toast.error('Gagal diperbarui', {
          position: 'top-right',
          richColors: true,
          description: err.message || 'Data pengguna gagal diperbarui',
        })
      },
    })
  }

  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Guru', value: 'teacher' },
    { label: 'Super admin', value: 'super_admin' },
  ]

  useEffect(() => {
    form.reset({
      username: data?.data?.username,
      email: data?.data?.email,
      role: data?.data?.role,
    })
  }, [data, form])
  return (
    <section className="space-y-6 pt-4">
      <h1 className="text-4xl font-bold">Edit Akun Pengguna</h1>
      <div className="bg-white rounded-2xl p-8">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 ">
              <div className="grid grid-cols-2 gap-4">
                <InputText name="username" label="Username" required />
                <SelectInput
                  name="role"
                  label="Role"
                  placeholder="Pilih Role"
                  required
                  options={roleOptions || []}
                />
                <InputText name="email" label="Email" required />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router({ to: '/dashboard/users' })}
              >
                Batal
              </Button>
              <Button type="submit" isLoading={isPending}>
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}
