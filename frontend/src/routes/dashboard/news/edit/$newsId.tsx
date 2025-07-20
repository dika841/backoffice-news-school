import type { TNewsResponseOne } from '@/api/news/type'
import { InputText } from '@/components/shared/input-text/Input-text'
import { ControlledRichTextEditor } from '@/components/shared/rich-text-editor/controlled-rich-text-editor'
import { SelectInput } from '@/components/shared/select-input/select-input'
import { ImageUpload } from '@/components/shared/upload-images/upload-images'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ApiUrl } from '@/constants'
import { useUpdateNewsMutation } from '@/hooks/mutation/use-news-mutation/use-news-mutation'
import { useCategoriesQuery } from '@/hooks/query/use-categories-query/use-categories-query'
import { useGetNewsByIdQuery } from '@/hooks/query/use-news-query/use-news-query'
import { newsFormSchema, type TNewsFormValues } from '@/lib/schema/news.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/news/edit/$newsId')({
  component: () => {
    const params = Route.useParams()

    const { data } = useGetNewsByIdQuery(params.newsId)

    return <NewsEditPage data={data ?? ({} as TNewsResponseOne)} />
  },
})

function NewsEditPage({ data }: { data: TNewsResponseOne }) {
  const form = useForm<TNewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: data?.data?.title,
      excerpt: data?.data?.excerpt,
      category_id: data?.data?.category_id,
      content: data?.data?.content,
    },
  })
  const id = Route.useParams().newsId
  const updateNewsMutate = useUpdateNewsMutation(id)
  const router = Route.useNavigate()
  const { data: categories } = useCategoriesQuery()

  const categoriesOptions = categories?.data?.map((category) => ({
    label: category.name,
    value: category.id,
  }))
  const handleUpdate = (data: TNewsFormValues) => {
    updateNewsMutate.mutate(data, {
      onSuccess: () => {
        toast.success('Berita berhasil diperbarui', {
          position: 'top-right',
          richColors: true,
          description: 'Data baru berhasil disimpan',
        })
        router({
          to: '/dashboard',
        })
      },
      onError: (error) => {
        toast.error('Berita gagal diperbarui', {
          position: 'top-right',
          richColors: true,
          description: error.message || 'Terjadi kesalahan',
        })
      },
    })
  }
  useEffect(() => {
    if (data?.data) {
      form.reset({
        title: data.data.title,
        excerpt: data.data.excerpt,
        category_id: data.data.category_id,
        content: data.data.content,
        featured_image: `${ApiUrl}${data.data.featured_image}`,
      })
    }
  }, [data, form])

  return (
    <section className="space-y-8 pb-14 pt-6">
      <h1 className="text-4xl font-bold">Edit Berita</h1>
      <div className="bg-white rounded-2xl p-8">
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(handleUpdate)}
          >
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
                <InputText name="excerpt" label="Ringkasan" required />
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
              <Button type="submit" isLoading={updateNewsMutate.isPending}>
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}
