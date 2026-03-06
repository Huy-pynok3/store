export interface SalesPoint {
  date: string
  value: number
}

export type UserShopSection = 'sales' | 'shop'

export interface ShopListing {
  id: string
  name: string
  category: string
  duplicateRate: number
  resellerEnabled: boolean
  unitPrice: number
  discountPercent: number
  stock: number
  createdAt: string
  status: string
  shopType?: 'Sản phẩm' | 'Dịch vụ'
}

export interface InventoryItem {
  id: string
  name: string
  price: number
  status: 'active' | 'inactive'
  stock: number
}
