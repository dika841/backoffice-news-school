'use client'

import * as React from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

// Define types for filter options and selected filters
interface FilterOption {
  value: string
  label: string
}

interface Filters {
  categories: string[]
  statuses: string[]
}

interface FilterComponentProps {
  onFilterChange?: (filters: Filters) => void
  initialFilters?: Filters
}

// Mock data for filter options
const categoryOptions: FilterOption[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'design', label: 'Design' },
]

const statusOptions: FilterOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

export function FilterComponent({
  onFilterChange,
  initialFilters,
}: FilterComponentProps) {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    initialFilters?.categories || [],
  )
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>(
    initialFilters?.statuses || [],
  )

  // Effect to call onFilterChange when filters change
  React.useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        statuses: selectedStatuses,
      })
    }
  }, [selectedCategories, selectedStatuses, onFilterChange])

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category),
    )
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status),
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedStatuses([])
  }

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedStatuses.length > 0

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-1 bg-transparent"
          >
            Filter <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categoryOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedCategories.includes(option.value)}
              onCheckedChange={(checked) =>
                handleCategoryChange(option.value, checked)
              }
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedStatuses.includes(option.value)}
              onCheckedChange={(checked) =>
                handleStatusChange(option.value, checked)
              }
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedCategories.map((category) => (
        <Badge
          key={category}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {categoryOptions.find((opt) => opt.value === category)?.label ||
            category}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => handleCategoryChange(category, false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {selectedStatuses.map((status) => (
        <Badge
          key={status}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {statusOptions.find((opt) => opt.value === status)?.label || status}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => handleStatusChange(status, false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  )
}
