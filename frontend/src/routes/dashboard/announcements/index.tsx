import type {
  TAnnouncementsParams,
  TAnnouncementsResponse,
} from '@/api/announcement/type'
import type { TResponse } from '@/common'
import { PaginationCustom } from '@/components/shared/pagination-custom/pagination-custom'
import { PopUpDelete } from '@/components/shared/popups'
import { SwitchFormField } from '@/components/shared/switch-input/switch-input'
import { TableActions } from '@/components/shared/table-actions/table-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDebounce, useObjectState } from '@/hooks/general'
import { useDeleteAnnounMutation } from '@/hooks/mutation/use-announ-mutation/use-announ-mutation'
import { useGetAnnouncementsQuery } from '@/hooks/query/use-announs-query/use-announcements-query'
import { dateFormat } from '@/utils/helper'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/announcements/')({
  validateSearch: (search: Record<string, unknown>): TAnnouncementsParams => {
    return {
      page: Number(search.page ?? 1),
      limit: Number(search.limit ?? 10),
      sort: (search.sort as string) || 'is_important',
    }
  },
  component: () => {
    const paramsQuery = Route.useSearch()
    const { data, isFetching } = useGetAnnouncementsQuery(paramsQuery)

    return (
      <AnnouncementComponent
        data={data as TResponse<TAnnouncementsResponse>}
        isFetching={isFetching}
      />
    )
  },
})

function AnnouncementComponent({
  data,
  isFetching,
}: {
  data: TResponse<TAnnouncementsResponse>
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
  const deleteMutate = useDeleteAnnounMutation()
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
    <section className="space-y-6 pt-4">
      <h1 className="text-4xl font-bold">Pengumuman</h1>
      <div className="flex w-full flex-col gap-4">
        <div className="flex justify-between">
          <Input
            type="search"
            placeholder="Cari penggumuman ..."
            className="w-full max-w-[384px] rounded-sm shadow-none bg-white"
            onChange={(e) => handleSearch(e)}
          />
          <Link to="/dashboard/announcements/create">
            <Button size="lg" className="rounded-xl font-normal">
              <Plus /> Tambah Pengumuman
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
              <TableHead>Tanggal berlaku</TableHead>
              <TableHead>Tanggal selesai</TableHead>
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
                  Tidak ada data Pengumuman yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {dateFormat(item.start_date.toLocaleString())}
                  </TableCell>
                  <TableCell>
                    {dateFormat(item.end_date.toLocaleString())}
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    {item.is_important ? (
                      <Badge variant={'default'}>Active</Badge>
                    ) : (
                      <Badge variant={'destructive'}>Non Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <SwitchFormField
                      id={item.id}
                      endpoint="/announcements"
                      fieldName="is_important"
                      defaultValue={item.is_important as boolean}
                      queryKey="announcements"
                    />
                  </TableCell>
                  <TableCell>
                    <TableActions
                      actions={[
                        {
                          label: 'Edit Pengumuman',
                          icon: Pencil,
                          onClick: () => {
                            router({
                              to: `/dashboard/announcements/edit/${item.slug}`,
                            })
                          },
                        },
                        {
                          label: 'Delete Pengumuman',
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
              })
              queryClient.invalidateQueries({
                queryKey: ['announcements'],
              })
            },
            onError: () => {
              toast.error('Gagal dihapus', {
                position: 'top-right',
                richColors: true,
              })
            },
          })
        }}
      />
    </section>
  )
}
