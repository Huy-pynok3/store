import { UserShopSection } from '../types'

interface SidebarItem {
  id: string
  label: string
  icon: string
  section?: UserShopSection
}

interface UserShopSidebarProps {
  activeSection: UserShopSection
  onChangeSection: (section: UserShopSection) => void
}

const menuGroups: Array<{ title: string; items: SidebarItem[] }> = [
  {
    title: 'SALE',
    items: [{ id: 'sales', label: 'Sales', icon: 'fa-regular fa-square-check', section: 'sales' }],
  },
  {
    title: 'SHOP',
    items: [
      { id: 'shop', label: 'Quản lý gian hàng', icon: 'fa-solid fa-store', section: 'shop' },
      { id: 'order-product', label: 'Đơn hàng sản phẩm', icon: 'fa-solid fa-file-invoice-dollar' },
      { id: 'order-service', label: 'Đơn hàng dịch vụ', icon: 'fa-solid fa-list' },
      { id: 'pre-order', label: 'Đặt trước', icon: 'fa-solid fa-clock' },
      { id: 'complaint', label: 'Khiếu nại', icon: 'fa-solid fa-bug' },
      { id: 'reseller', label: 'Quản lý Reseller', icon: 'fa-solid fa-users' },
      { id: 'review', label: 'Đánh giá', icon: 'fa-regular fa-comments' },
      { id: 'voucher', label: 'Mã giảm giá', icon: 'fa-solid fa-dollar-sign' },
      { id: 'top-shop', label: 'Gian hàng Top 1', icon: 'fa-solid fa-trophy' },
    ],
  },
]

export default function UserShopSidebar({ activeSection, onChangeSection }: UserShopSidebarProps) {
  return (
    <aside className="w-full md:w-[260px] bg-[#0f2346] text-[#d8e3f7] shadow-xl md:min-h-screen">
      <div className="flex h-[74px] items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5f70f8] font-bold text-white">
          M
        </div>
        <p className="text-[18px] leading-none font-semibold text-white">taphoammo.net</p>
      </div>

      <div className="space-y-6 py-4">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="px-5 pb-2 text-xs font-semibold tracking-[0.12em] text-[#8fa3cb]">{group.title}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => item.section && onChangeSection(item.section)}
                    className={`flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm transition-colors ${
                      item.section === activeSection
                        ? 'bg-[#1c355f] text-white'
                        : 'text-[#d8e3f7] hover:bg-[#173058]'
                    }`}
                  >
                    <i className={`${item.icon} w-4 text-center`} aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  )
}

