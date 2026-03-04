'use client'

import { useState } from 'react'
import ShopDetailForm from './components/ShopDetailForm'
import UserShopSidebar from './components/UserShopSidebar'
import SalesChartCard from './components/SalesChartCard'
import ShopManagementTable from './components/ShopManagementTable'
import { shopListings } from './data/shopListings'
import { last30DaysSales } from './data/sales'
import { UserShopSection } from './types'

export default function UserShopDashboard() {
  const [activeSection, setActiveSection] = useState<UserShopSection>('sales')
  const [editingShopId, setEditingShopId] = useState<string | null>(null)

  const editingShop = shopListings.find((listing) => listing.id === editingShopId) || null

  function handleChangeSection(section: UserShopSection) {
    setActiveSection(section)
    if (section !== 'shop') setEditingShopId(null)
  }

  return (
    <main className="min-h-screen bg-[#e7ebf3] md:flex">
      <UserShopSidebar activeSection={activeSection} onChangeSection={handleChangeSection} />

      <section className="flex-1">
        <div className="flex h-[74px] items-center justify-between border-b border-[#d8dfec] bg-white px-5 md:px-8">
          <button type="button" className="text-[#55637a]" aria-label="Toggle sidebar">
            <i className="fa-solid fa-bars text-lg" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-4 text-[#55637a]">
            <i className="fa-regular fa-comment-dots text-xl" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-[#f5c8a5]" />
              <span className="text-sm font-medium">trammo</span>
              <i className="fa-solid fa-angle-down text-xs" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {activeSection === 'sales' ? (
            <SalesChartCard data={last30DaysSales} />
          ) : editingShop ? (
            <ShopDetailForm item={editingShop} onBack={() => setEditingShopId(null)} />
          ) : (
            <ShopManagementTable items={shopListings} onEdit={(item) => setEditingShopId(item.id)} />
          )}
        </div>
      </section>
    </main>
  )
}


