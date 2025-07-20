import type { TCategory } from '@/api/categories/type'
import type { TResponse } from '@/common'
import { PopUpDelete } from '@/components/shared/popups'
import { TableActions } from '@/components/shared/table-actions/table-actions'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useObjectState } from '@/hooks/general'
import { useDeleteCategoryMutation } from '@/hooks/mutation/use-category-mutation/use-category-mutation'
import { useCategoriesQuery } from '@/hooks/query/use-categories-query/use-categories-query'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/categories/')({
  component: () => {
    const { data, isFetching } = useCategoriesQuery()

    return (
      <CategoriesPage
        data={data as TResponse<TCategory[]>}
        isFetching={isFetching}
      />
    )
  },
})

function CategoriesPage({
  data,
  isFetching,
}: {
  data: TResponse<TCategory[]>
  isFetching: boolean
}) {
  const router = Route.useNavigate()
  const [openDelete, setOpenDelete] = useObjectState({
    open: false,
    uuid: '',
  })

  const queryClient = useQueryClient()
  const deleteMutate = useDeleteCategoryMutation()

  return (
    <section className="space-y-6 pt-4">
      <h1 className="text-4xl font-bold">Kategori</h1>
      <div className="flex w-full flex-col gap-4">
        <div className="flex justify-end">
          <Link to="/dashboard/categories/create">
            <Button size="lg" className="rounded-xl font-normal">
              <Plus /> Tambah Kategori
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white border space-y-6 border-gray-200 rounded-xl px-4 py-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Deskripsi</TableHead>
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
            ) : data?.data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  Tidak ada data kategoriS yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <TableActions
                      actions={[
                        {
                          label: 'Edit Kategori',
                          icon: Pencil,
                          onClick: () => {
                            router({
                              to: `/dashboard/categories/edit/${item.id}`,
                            })
                          },
                        },
                        {
                          label: 'Delete Kategori',
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
                queryKey: ['categories'],
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
