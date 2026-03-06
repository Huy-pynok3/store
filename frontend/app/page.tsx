import { Button } from '../components/ui'
import SidebarCard from '../components/layout/SidebarCard'
import CategorySection from '../components/CategorySection'
import ServiceSection from '../components/ServiceSection'
import ShortcutSection from '../components/ShortcutSection'
import ProductGrid from '../components/ProductGrid'
import AboutSection from '../components/AboutSection'
import SearchBanner from '../components/SearchBanner'

const sidebarProduct = {
  warehouse: '1324',
  priceRange: '48.999 đ - 219.999 đ',
  productType: 'Sản phẩm',
  title: 'Facebook Việt Có 1000-5000 Bạn Bè Tạo 2005-2022',
  rating: 4,
  reviews: 1807,
  sold: 206074,
  complaints: '0.0%',
  seller: 'shopbanreuytin',
  category: 'Tài khoản FB',
  icon: 'facebook' as const,
  iconBgColor: '#446cb3',
  features: [
    'FB that ban be chon loc nhieu bai dang - chinh sach bao hanh ap dung cho toan gian hang doc ki truoc khi mua',
    'Kinh doanh: FB VN 2024-2025 tren 18 tuoi 300bb doi ten spam oke',
    'Hotmail | FB random 20 bai dang de sua, tren 18t doi dc, ten oke',
    'FB Viet 550-5000 ban be 2015-2025 >18t co bai dang gan day | FB co 1x rd name 1000-5000 bb rd w',
    'Tren 18t hotmail 2FA | FB Viet 150-1000 ban be 2020-2025 tren 18t doi dc ten oke'
  ]
}

export default function Home() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-4 items-start">
        <aside className="hidden xl:block sticky top-[110px]">
          <SidebarCard {...sidebarProduct} />
        </aside>

        <main>
          <SearchBanner />
          <CategorySection />
          <ServiceSection />
          <ShortcutSection />
          <ProductGrid />
          <AboutSection />
        </main>

        <aside className="hidden xl:block sticky top-[110px]">
          <SidebarCard {...sidebarProduct} />
        </aside>
      </div>
    </div>
  )
}
