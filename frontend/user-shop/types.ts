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
}
