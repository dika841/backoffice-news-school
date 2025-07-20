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
import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useDeleteNewsMutation } from '@/hooks/mutation/use-news-mutation/use-news-mutation'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { SwitchFormField } from '@/components/shared/switch-input/switch-input'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/dashboard/')({
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
    const newsData = useMemo(() => data, [data])
    return (
      <NewsComponent
        data={newsData as TResponse<TNewsResponse>}
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
  const deleteMutate = useDeleteNewsMutation()
  const queryClient = useQueryClient()
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  useEffect(() => {
    router({
      search: (prev) => ({ ...prev, search: debounceSearch, page: 1 }),
    })
  }, [debounceSearch])
  return (
    <section className="space-y-4 pt-4">
      <h1 className="text-4xl font-bold">Berita</h1>
      <div className="flex w-full flex-col gap-4">
        <div className="flex justify-between">
          <Input
            type="search"
            placeholder="Cari berita ..."
            className="w-full max-w-[384px] rounded-sm shadow-none bg-white"
            onChange={(e) => handleSearch(e)}
          />
          <Link to="/dashboard/news/create">
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
              <TableHead>Status</TableHead>
              <TableHead>Aktivasi</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
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
                    {item.is_published ? (
                      <Badge variant={'default'}>Published</Badge>
                    ) : (
                      <Badge variant={'destructive'}>Unpublished</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <SwitchFormField
                      id={item.id}
                      endpoint="/news"
                      fieldName="is_published"
                      defaultValue={item.is_published as boolean}
                      queryKey="news"
                    />
                  </TableCell>
                  <TableCell>
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
                          label: 'Delete Berita',
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
        onConfirm={() => {
          deleteMutate.mutate(openDelete.uuid, {
            onSuccess: () => {
              setOpenDelete({ open: false, uuid: '' })
              toast.success('Berhasil dihapus', {
                position: 'top-right',
                richColors: true,
                description: 'Data baru berhasil dihapus',
              })
              queryClient.invalidateQueries({
                queryKey: ['news'],
              })
            },
            onError: (error) => {
              toast.error('Gagal dihapus', {
                position: 'top-right',
                richColors: true,
                description: error.message || 'Terjadi kesalahan',
              })
            },
          })
        }}
      />
    </section>
  )
}
