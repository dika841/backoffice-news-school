import { InputText } from '@/components/shared/input-text/Input-text'
import { ControlledRichTextEditor } from '@/components/shared/rich-text-editor/controlled-rich-text-editor'
import { SelectInput } from '@/components/shared/select-input/select-input'
import { ImageUpload } from '@/components/shared/upload-images/upload-images'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useNewsMutation } from '@/hooks/mutation/use-news-mutation/use-news-mutation'
import { useCategoriesQuery } from '@/hooks/query/use-categories-query/use-categories-query'
import { newsFormSchema, type TNewsFormValues } from '@/lib/schema/news.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/news/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm<TNewsFormValues>({
    resolver: zodResolver(newsFormSchema),
  })
  const { data: categories } = useCategoriesQuery()

  const categoriesOptions = categories?.data?.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const router = Route.useNavigate()

  const { mutate, isPending } = useNewsMutation()
  const onSubmit = (data: TNewsFormValues) => {
    mutate(
      {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category_id: data.category_id || '',
        featured_image: data.featured_image,
      },
      {
        onSuccess: () => {
          toast.success('Berita berhasil ditambahkan', {
            position: 'top-right',
            richColors: true,
            description: 'Data baru berhasil disimpan',
          })
          router({
            to: '/dashboard',
          })
        },
        onError: (error) => {
          toast.error('Berita gagal ditambahkan', {
            position: 'top-right',
            richColors: true,
            description: error.message || 'Terjadi kesalahan',
          })
        },
      },
    )
  }
  return (
    <section className="space-y-8 py-4">
      <h1 className="text-4xl font-bold">Tulis Berita</h1>
      <div className="bg-white rounded-2xl p-8">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 ">
              <div className="grid grid-cols-2 gap-4">
                <InputText name="title" label="Title" required />
                <SelectInput
                  name="category_id"
                  label="Kategori"
                  placeholder="Pilih Kategori"
                  required
                  options={categoriesOptions || []}
                />
                <InputText name="excerpt" label="Ringakasan" required />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Konten
                  <span className="text-destructive ml-2">*</span>
                </label>
                <ControlledRichTextEditor name="content" required />
              </div>
              <ImageUpload
                name="featured_image"
                label="Gambar Utama"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => router({ to: '/dashboard' })}
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
