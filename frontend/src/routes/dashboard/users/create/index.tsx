import type { TUsersRequest } from '@/api/users/type'
import { InputText } from '@/components/shared/input-text/Input-text'
import { SelectInput } from '@/components/shared/select-input/select-input'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useCreateUserMutation } from '@/hooks/mutation/use-user-mutation/use-user-mutation'
import { userSchema, type TUserSchema } from '@/lib/schema/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/users/create/')({
  component: CreateUser,
})

function CreateUser() {
  const form = useForm<TUserSchema>({
    resolver: zodResolver(userSchema),
    mode: 'all',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: '',
    },
  })

  const router = Route.useNavigate()

  const { mutate, isPending } = useCreateUserMutation()
  const onSubmit = (data: TUsersRequest) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Berhasil ditambahkan', {
          position: 'top-right',
          richColors: true,
          description: 'Pengguna baru berhasil ditambahkan',
        })
        router({
          to: '/dashboard/users',
        })
      },
      onError: (err) => {
        toast.error('Gagal ditambahkan', {
          position: 'top-right',
          richColors: true,
          description: err.message || 'Pengguna gagal ditambahkan',
        })
      },
    })
  }

  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Guru', value: 'teacher' },
    { label: 'Super admin', value: 'super_admin' },
  ]
  return (
    <section className="space-y-6 pt-4">
      <h1 className="text-4xl font-bold">Tambah Akun Pengguna</h1>
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
                <InputText name="password" label="Password" required />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
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
