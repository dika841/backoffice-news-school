import type { TNewsParams, TNewsResponse } from '@/api/news/type'
import type { TResponse } from '@/common'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useGetNewsQuery } from '@/hooks/query/use-news-query/use-news-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { TableActions } from '@/components/shared/table-actions/table-actions'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useDebounce, useObjectState } from '@/hooks/general'
import { dateFormat } from '@/utils/helper'
import { PopUpDelete } from '@/components/shared/popups'
import { PaginationCustom } from '@/components/shared/pagination-custom/pagination-custom'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/dashboard/_dashboard/')({
  validateSearch: (search: Record<string, unknown>): TNewsParams => {
    return {
      page: Number(search.page ?? 1),
      limit: Number(search.limit ?? 10),
      sort: (search.sort as string) || 'published_at_desc',
    }
  },
  component: () => {
    const paramsQuery = Route.useSearch()
    const { data, isFetching } = useGetNewsQuery(paramsQuery)

    return (
      <NewsComponent
        data={data ?? ({} as TResponse<TNewsResponse>)}
        isFetching={isFetching}
      />
    )
  },
})

function NewsComponent({
  data,
  isFetching,
}: {
  data: TResponse<TNewsResponse>
  isFetching: boolean
}) {
  const router = Route.useNavigate()
  const searchParams = Route.useSearch()
  const [searchQuery, setSearchQuery] = useState('')
  const debounceSearch = useDebounce(searchQuery, 500)
  const [itemsPerPage, setItemsPerPage] = useState(searchParams.limit)
  const [openDelete, setOpenDelete] = useObjectState({
    open: false,
    uuid: '',
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  useEffect(() => {
    router({
      search: (prev) => ({ ...prev, search: debounceSearch, page: 1 }),
    })
  }, [debounceSearch])
  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-bold">Berita</h1>
      <div className="flex w-full flex-col gap-4">
        <div className="flex justify-between">
          <Input
            type="search"
            placeholder="Cari berita ..."
            className="w-full max-w-[384px] rounded-sm shadow-none"
            onChange={(e) => handleSearch(e)}
          />
          <Link to="/dashboard">
            <Button size="lg" className="rounded-xl font-normal">
              <Plus /> Tambah berita
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white border space-y-6 border-gray-200 rounded-xl px-4 py-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Tanggal dibuat</TableHead>
              <TableHead>Tanggal diperbarui</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Publis</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              // 5 baris skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 w-full max-w-[80%] animate-pulse rounded bg-gray-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  Tidak ada data berita yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {dateFormat(item.published_at as string)}
                  </TableCell>
                  <TableCell>{dateFormat(item.updated_at as string)}</TableCell>
                  <TableCell>{item.author_username}</TableCell>
                  <TableCell>
                    {item.is_published ? 'Published' : 'Not Published'}
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <TableActions
                      actions={[
                        {
                          label: 'Edit Berita',
                          icon: Pencil,
                          onClick: () => {
                            router({
                              to: `/dashboard/news/edit/${item.id}`,
                            })
                          },
                        },
                        {
                          label: 'Delete User',
                          icon: Trash2,
                          onClick: () => {
                            setOpenDelete({
                              open: true,
                              uuid: item?.id ?? '',
                            })
                          },
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <PaginationCustom
          className="justify-end"
          currentPage={searchParams.page as number}
          totalItems={data?.data?.total ?? 0}
          itemsPerPage={itemsPerPage as number}
          onItemsPerPageChange={(newLimit) => {
            setItemsPerPage(newLimit)
            router({
              search: (prev) => ({ ...prev, limit: newLimit, page: 1 }),
            })
          }}
          onPageChange={(newPage) => {
            router({
              search: (prev) => ({ ...prev, page: newPage }),
            })
          }}
        />
      </div>
      <PopUpDelete
        show={openDelete.open}
        setShow={(show) => setOpenDelete(() => ({ open: show }))}
        onCancel={() => setOpenDelete({ open: false, uuid: '' })}
      />
    </section>
  )
}
