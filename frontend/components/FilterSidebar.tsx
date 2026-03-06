'use client'

import { Card, Button, Checkbox, ArticleCard } from './ui'
import { SubTypeCount } from '@/types/listing'

interface FilterSidebarProps {
  subTypeCounts?: SubTypeCount[]
  selectedSubTypes?: string[]
  onSubTypesChange?: (subTypes: string[]) => void
  onSearch?: () => void
}

export default function FilterSidebar({
  subTypeCounts = [],
  selectedSubTypes = [],
  onSubTypesChange,
  onSearch
}: FilterSidebarProps) {
  const toggleSubType = (value: string) => {
    if (!onSubTypesChange) return
    
    const newSelection = selectedSubTypes.includes(value)
      ? selectedSubTypes.filter(v => v !== value)
      : [...selectedSubTypes, value]
    onSubTypesChange(newSelection)
  }

  return (
    <aside className="sticky top-[110px]">
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Bộ lọc</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Chọn 1 hoặc nhiều sản phẩm
          </h4>
          <div className="space-y-2">
            {subTypeCounts.map((subType) => (
              <div key={subType.value} className="flex items-center justify-between">
                <Checkbox
                  checked={selectedSubTypes.includes(subType.value)}
                  onChange={() => toggleSubType(subType.value)}
                  label={subType.label}
                />
                <span className="text-xs text-gray-500">({subType.count})</span>
              </div>
            ))}
          </div>
        </div>

        <Button variant="success" fullWidth onClick={onSearch}>
          Tìm kiếm
        </Button>
      </Card>

      <Card className="mt-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Bài viết tham khảo
        </h3>
        <div className="space-y-3">
          <ArticleCard
            title="Tại sao nên chọn đầu tư nhà đất trong thời điểm này?"
            category="Tài chính"
            views="1.8K0"
            gradient="bg-gradient-to-br from-blue-500 to-purple-600"
            icon="fas fa-chart-line"
          />
        </div>
      </Card>
    </aside>
  )
}
