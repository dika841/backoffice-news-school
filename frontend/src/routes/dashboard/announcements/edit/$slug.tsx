import type { TAnnouncementsResponseOne } from '@/api/announcement/type'
import { DatePickerInput } from '@/components/shared/date-time/date-time'
import { InputText } from '@/components/shared/input-text/Input-text'
import { ControlledRichTextEditor } from '@/components/shared/rich-text-editor/controlled-rich-text-editor'
import { SelectInput } from '@/components/shared/select-input/select-input'
import { ImageUpload } from '@/components/shared/upload-images/upload-images'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useUpdateAnnounMutation } from '@/hooks/mutation/use-announ-mutation/use-announ-mutation'
import { useGetAnnouncementsBySlugQuery } from '@/hooks/query/use-announs-query/use-announcements-query'
import { useCategoriesQuery } from '@/hooks/query/use-categories-query/use-categories-query'
import {
  AnnouncementInputSchema,
  type TAnnouncements,
} from '@/lib/schema/announcements.schema'
import { formatToMySQLDatetime } from '@/utils/helper'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/announcements/edit/$slug')({
  component: () => {
    const params = Route.useParams()

    const { data } = useGetAnnouncementsBySlugQuery(params.slug)

    return <EditAnnouncement data={data ?? ({} as TAnnouncementsResponseOne)} />
  },
})

function EditAnnouncement({ data }: { data: TAnnouncementsResponseOne }) {
  const form = useForm<TAnnouncements>({
    resolver: zodResolver(AnnouncementInputSchema),
    mode: 'onChange',
    defaultValues: {
      title: data?.data?.title,
      category_id: data?.data?.category_id,
      content: data?.data?.content,
      start_date: data?.data?.start_date,
      end_date: data?.data?.end_date,
      featured_image: data?.data?.featured_image,
      is_important: data?.data?.is_important,
    },
  })
  const { data: categories } = useCategoriesQuery()

  const categoriesOptions = categories?.data?.map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const router = Route.useNavigate()
  const slug = Route.useParams().slug
  const { mutate, isPending } = useUpdateAnnounMutation(slug)
  const onSubmit = (data: TAnnouncements) => {
    mutate(
      {
        ...data,
        start_date: formatToMySQLDatetime(data.start_date),
        end_date: formatToMySQLDatetime(data.end_date),
        is_important: 1,
      },
      {
        onSuccess: () => {
          toast.success('Berhasil diperbarui', {
            position: 'top-right',
            richColors: true,
            description: 'Pengumuman baru berhasil diperbarui',
          })
          router({
            to: '/dashboard/announcements',
          })
        },
        onError: (error) => {
          toast.error('Gagal diperbarui', {
            position: 'top-right',
            richColors: true,
            description: error.message || 'Pengumuman gagal diperbarui',
          })
        },
      },
    )
  }

  useEffect(() => {
    form.reset({
      title: data?.data?.title,
      category_id: data?.data?.category_id,
      content: data?.data?.content,
      start_date: data?.data?.start_date,
      end_date: data?.data?.end_date,
      featured_image: data?.data?.featured_image,
      is_important: data?.data?.is_important,
    })
  }, [data, form])

  return (
    <section className="space-y-8 py-8">
      <h1 className="text-4xl font-bold">Edit Pengumuman</h1>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DatePickerInput
                  label="Tanggal Awal Berlaku"
                  name="start_date"
                  placeholder="Pilih Tanggal"
                  required
                  description="Pilih tanggal mulai berlaku Pengumuman"
                />
                <DatePickerInput
                  label="Tanggal akhir Berlaku"
                  name="end_date"
                  placeholder="Pilih Tanggal"
                  required
                  description="Pilih tanggal berakhir berlaku Pengumuman"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Konten
                  <span className="text-destructive ml-2">*</span>
                </label>
                <ControlledRichTextEditor name="content" required />
              </div>
              <ImageUpload name="featured_image" label="Gambar Utama" />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router({ to: '/dashboard/announcements' })}
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
