import type { TCategory, TCategoryResponseOne } from '@/api/categories/type'
import { InputText } from '@/components/shared/input-text/Input-text'
import { TextAreaInput } from '@/components/shared/text-area-input/text-area-input'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useUpdateCategoryMutation } from '@/hooks/mutation/use-category-mutation/use-category-mutation'
import { useCategoriesQueryById } from '@/hooks/query/use-categories-query/use-categories-query'
import {
  categorySchema,
  type TCategorySchema,
} from '@/lib/schema/categories.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/categories/edit/$categoryId')({
  component: () => {
    const data = useCategoriesQueryById(Route.useParams().categoryId)
    return <EditCategory data={data.data?.data ?? ({} as TCategory)} />
  },
})

function EditCategory(data: TCategoryResponseOne) {
  const form = useForm<TCategorySchema>({
    resolver: zodResolver(categorySchema),
    mode: 'all',
    defaultValues: {
      name: data.data?.name ?? '',
      description: '',
    },
  })

  const router = Route.useNavigate()
  const id = Route.useParams().categoryId
  const { mutate, isPending } = useUpdateCategoryMutation(id)
  const onSubmit = (data: TCategorySchema) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Berhasil diperbarui', {
          position: 'top-right',
          richColors: true,
          description: 'Kategori baru berhasil diperbarui',
        })
        router({
          to: '/dashboard/categories',
        })
      },
      onError: (error) => {
        toast.error('Gagal diperbarui', {
          position: 'top-right',
          richColors: true,
          description: error.message || 'Kategori gagal diperbarui',
        })
      },
    })
  }
  useEffect(() => {
    form.reset({
      name: data.data?.name ?? '',
      description: data.data?.description ?? '',
    })
  }, [data])
  return (
    <section className="space-y-8 py-8">
      <h1 className="text-4xl font-bold">Edit Kategori</h1>
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
