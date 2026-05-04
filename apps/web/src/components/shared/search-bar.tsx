'use client'

import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  defaultValue?: string
  showFilters?: boolean
  onFiltersClick?: () => void
  className?: string
}

export function SearchBar({
  placeholder = 'Search projects, builders, or RERA number…',
  onSearch,
  defaultValue = '',
  showFilters = false,
  onFiltersClick,
  className,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      const timeout = setTimeout(() => onSearch(e.target.value), 300)
      return () => clearTimeout(timeout)
    },
    [onSearch]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)} role="search">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="pl-9"
          aria-label="Search"
        />
      </div>
      {showFilters && (
        <Button type="button" variant="outline" onClick={onFiltersClick} aria-label="Toggle filters">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      )}
      <Button type="submit">Search</Button>
    </form>
  )
}
