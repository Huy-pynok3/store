'use client'

import { useState } from 'react'
import { Card, Button, Checkbox, ArticleCard } from './ui'

const categories = [
  { id: 'gmail', name: 'Gmail', count: 15 },
  { id: 'hotmail', name: 'Hotmail', count: 8 },
  { id: 'outlookmail', name: 'OutlookMail', count: 12 },
  { id: 'iuumail', name: 'IuuMail', count: 3 },
  { id: 'domainmail', name: 'DomainMail', count: 6 },
  { id: 'yahoomail', name: 'YahooMail', count: 4 },
  { id: 'protonmail', name: 'ProtonMail', count: 2 },
  { id: 'loai-mail-khac', name: 'Loại Mail Khác', count: 7 },
]

export default function FilterSidebar() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
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
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between">
                <Checkbox
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  label={cat.name}
                />
                <span className="text-xs text-gray-500">({cat.count})</span>
              </div>
            ))}
          </div>
        </div>

        <Button variant="success" fullWidth>
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
