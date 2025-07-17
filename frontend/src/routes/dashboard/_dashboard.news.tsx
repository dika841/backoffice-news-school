import CardCustom from '@/components/shared/card-custom/card-custom'
import { FilterComponent } from '@/components/shared/filter/filter'
import { SearchBox } from '@/components/shared/search/search'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_dashboard/news')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-bold">Berita</h1>
      <div className="flex gap-2 items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-x-4">
          <Button>+ Tambah Berita </Button>
          <SearchBox />
        </div>
        <FilterComponent />
      </div>
      <div className="grid grid-cols-3 gap-4  items-center  bg-white border border-gray-200 rounded-xl px-4 py-8">
        <CardCustom
          id={''}
          title={'Semua Berita Terbaru Dari Kami Aja'}
          description={
            ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
          }
          author={' John Doe'}
          publishedDate={' 2024-01-15'}
          category={' Teknologi'}
        />
        <CardCustom
          id={''}
          title={'Semua Berita Terbaru Dari Kami Aja'}
          description={
            ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
          }
          author={' John Doe'}
          publishedDate={' 2024-01-15'}
          category={' Teknologi'}
        />
        <CardCustom
          id={''}
          title={'Semua Berita Terbaru Dari Kami Aja'}
          description={
            ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
          }
          author={' John Doe'}
          publishedDate={' 2024-01-15'}
          category={' Teknologi'}
        />
      </div>
    </section>
  )
}
