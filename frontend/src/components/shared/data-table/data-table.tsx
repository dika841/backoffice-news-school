'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Skeleton } from '@/components/ui/skeleton'
import { PaginationCustom } from '../pagination-custom/pagination-custom'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  totalItems: number
  isLoading?: boolean
  page: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  className?: string
  emptyMessage?: string
}

export function DataTable<TData>({
  data,
  columns,
  totalItems,
  isLoading = false,
  page,
  limit,
  onPageChange,
  onLimitChange,
  className = '',
  emptyMessage = 'No data available',
}: DataTableProps<TData>) {
  const pagination: PaginationState = {
    pageIndex: page - 1, // React Table menggunakan zero-based index
    pageSize: limit,
  }

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / limit),
    state: {
      pagination: {
        pageIndex: page - 1, // Convert to zero-based index
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater

      onPageChange(newPagination.pageIndex + 1) // Convert back to one-based
      onLimitChange(newPagination.pageSize)
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Important for server-side pagination
  })

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  {table.getAllColumns().map((column) => (
                    <TableCell key={`skeleton-${column.id}`}>
                      <Skeleton className="h-4 w-[80%]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalItems > 0 && (
        <PaginationCustom
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={(newPage) => onPageChange(newPage)}
          onItemsPerPageChange={(newLimit) => onLimitChange(newLimit)}
          className="justify-end"
        />
      )}
    </div>
  )
}
