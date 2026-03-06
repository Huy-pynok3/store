'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { NotificationBadge } from '@/components/ui'
import ShopDetailForm from './components/ShopDetailForm'
import UserShopSidebar from './components/UserShopSidebar'
import SalesChartCard from './components/SalesChartCard'
import ShopManagementTable from './components/ShopManagementTable'
import InventoryModal from './components/InventoryModal'
import { shopListings } from './data/shopListings'
import { last30DaysSales } from './data/sales'
import { ShopListing, UserShopSection } from './types'

const draftShop: ShopListing = {
  id: 'new-shop',
  name: 'Gian hàng mới',
  category: 'Tài khoản FB',
  duplicateRate: 0,
  resellerEnabled: false,
  unitPrice: 0,
  discountPercent: 0,
  stock: 0,
  createdAt: '06/03/2026',
  status: 'P - Chờ duyệt',
}

export default function UserShopDashboard() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const tabParam = searchParams.get('tab')
  const activeSection: UserShopSection = tabParam === 'sales' ? 'sales' : 'shop'
  const [editingShopId, setEditingShopId] = useState<string | null>(null)
  const [inventoryShop, setInventoryShop] = useState<ShopListing | null>(null)
  const [allowInventoryPreviewLink, setAllowInventoryPreviewLink] = useState(false)
  const [draftShopName, setDraftShopName] = useState(draftShop.name)

  const editingShop =
    editingShopId === draftShop.id
      ? { ...draftShop, name: draftShopName }
      : shopListings.find((listing) => listing.id === editingShopId) || null

  function handleCreateShop() {
    setAllowInventoryPreviewLink(false)
    setDraftShopName(draftShop.name)
    setEditingShopId(draftShop.id)
  }

  function handleOpenInventory(shop: ShopListing, canOpenProductDetail = false) {
    setAllowInventoryPreviewLink(canOpenProductDetail)
    setInventoryShop(shop)
  }

  function handleCreateShopSuccess(shopData: Partial<ShopListing>) {
    const createdShop = {
      ...draftShop,
      ...shopData,
      name: shopData.name || draftShop.name,
    }
    setDraftShopName(createdShop.name)
    setEditingShopId(null)
    handleOpenInventory(createdShop, true)
  }

  return (
    <main className="min-h-screen bg-[#e7ebf3] md:flex">
      <UserShopSidebar activeSection={activeSection} />

      <section className="flex-1">
        <div className="flex h-[74px] items-center justify-between border-b border-[#d8dfec] bg-white px-5 md:px-8">
          <button type="button" className="text-[#55637a]" aria-label="Toggle sidebar">
            <i className="fa-solid fa-bars text-lg" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-4 text-[#55637a]">
            <Link href="/chat-box" className="relative cursor-pointer hover:opacity-80 transition-opacity" aria-label="Tin nhắn">
              <i className="fa-regular fa-comment-dots text-xl" aria-hidden="true" />
              <NotificationBadge count={0} size="md" variant="red" position="custom" className="absolute -top-2 -right-2" />
            </Link>
            <div className="flex items-center gap-2">
              <img 
                src="https://mimity-admin896.netlify.app/dist/img/user.svg" 
                alt={user?.username || 'User'} 
                className="h-9 w-9 rounded-full"
              />
              <span className="text-sm font-medium">{user?.username || 'Guest'}</span>
              <i className="fa-solid fa-angle-down text-xs" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {activeSection === 'sales' ? (
            <SalesChartCard data={last30DaysSales} />
          ) : editingShop ? (
            <ShopDetailForm
              item={editingShop}
              onBack={() => setEditingShopId(null)}
              onInventory={() => handleOpenInventory(editingShop)}
              onSubmitSuccess={(shopData) => {
                if (editingShop.id === draftShop.id) {
                  handleCreateShopSuccess(shopData)
                }
              }}
            />
          ) : (
            <ShopManagementTable
              items={shopListings}
              onEdit={(item) => setEditingShopId(item.id)}
              onInventory={(item) => handleOpenInventory(item)}
              onCreate={handleCreateShop}
            />
          )}
        </div>
      </section>

      {inventoryShop && (
        <InventoryModal
          shop={inventoryShop}
          canOpenProductDetail={allowInventoryPreviewLink}
          onClose={() => {
            setInventoryShop(null)
            setAllowInventoryPreviewLink(false)
          }}
        />
      )}
    </main>
  )
}
