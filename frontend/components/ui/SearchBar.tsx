import { Input, Button, Select } from './index'

interface SearchBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filterValue?: string
  onFilterChange?: (value: string) => void
  filterOptions?: { value: string; label: string }[]
  onSearch: () => void
  searchPlaceholder?: string
  buttonText?: string
}

export default function SearchBar({
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  onSearch,
  searchPlaceholder = 'Tìm kiếm...',
  buttonText = 'Tìm kiếm'
}: SearchBarProps) {
  return (
    <div className="flex gap-3">
      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-80"
      />
      {filterOptions && onFilterChange && (
        <Select
          value={filterValue || ''}
          onChange={(e) => onFilterChange(e.target.value)}
          options={filterOptions}
          className="w-48"
        />
      )}
      <Button variant="success" onClick={onSearch}>
        {buttonText}
      </Button>
    </div>
  )
}
