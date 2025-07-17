import * as React from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
interface SearchBoxProps {
  onSearch?: (query: string) => void
  initialQuery?: string
}

export function SearchBox({ onSearch, initialQuery = '' }: SearchBoxProps) {
  const [searchValue, setSearchValue] = React.useState(initialQuery)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value)
    }
    inputRef.current?.blur() // Blur the input after search
  }

  return (
    <div className="relative w-[400px] max-w-lg mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Cari..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-20 h-10 text-base rounded-xl border-2 focus:border-primary transition-all duration-200"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(searchValue)
            }
            if (e.key === 'Escape') {
              inputRef.current?.blur()
            }
          }}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <Button
            size="sm"
            className="h-8 px-3 rounded-lg"
            onClick={() => handleSearch(searchValue)}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
