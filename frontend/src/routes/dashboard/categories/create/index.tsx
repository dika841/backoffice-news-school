import { InputText } from '@/components/shared/input-text/Input-text'
import { TextAreaInput } from '@/components/shared/text-area-input/text-area-input'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useCreateCategoryMutation } from '@/hooks/mutation/use-category-mutation/use-category-mutation'
import {
  categorySchema,
  type TCategorySchema,
} from '@/lib/schema/categories.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/categories/create/')({
  component: CreateCategory,
})

function CreateCategory() {
  const form = useForm<TCategorySchema>({
    resolver: zodResolver(categorySchema),
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const router = Route.useNavigate()

  const { mutate, isPending } = useCreateCategoryMutation()
  const onSubmit = (data: TCategorySchema) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Berhasil ditambahkan', {
          position: 'top-right',
          richColors: true,
          description: 'kategori baru berhasil ditambahkan',
        })
        router({
          to: '/dashboard/categories',
        })
      },
      onError: (error) => {
        toast.error('Gagal ditambahkan', {
          position: 'top-right',
          richColors: true,
          description: error.message || 'Kategori gagal ditambahkan',
        })
      },
    })
  }

  return (
    <section className="space-y-8 py-8">
      <h1 className="text-4xl font-bold">Tambah Kategori</h1>
      <div className="bg-white rounded-2xl p-8">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 ">
              <div className="grid grid-cols-2 gap-4">
                <InputText name="name" label="Kategori" required />
                <TextAreaInput
                  name="description"
                  label="Deskripsi (Opsional)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => router({ to: '/dashboard/categories' })}
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
