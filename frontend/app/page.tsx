import Image from 'next/image'
import { Button } from '../components/ui'
import SidebarCard from '../components/layout/SidebarCard'
import CategorySection from '../components/CategorySection'
import ServiceSection from '../components/ServiceSection'
import ShortcutSection from '../components/ShortcutSection'
import ProductGrid from '../components/ProductGrid'
import AboutSection from '../components/AboutSection'

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
          <section className="relative mb-4">
            <div className="relative h-[240px] sm:h-[280px] rounded-sm overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop"
                alt="Banner"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-white/45"></div>
              
              <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[860px] max-w-[80%] sm:max-w-[95%] z-10 px-2 sm:px-0">
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <select className="w-full sm:w-auto sm:flex-1 px-3 border border-[#d8d8d8] rounded-sm text-[13px] h-[34px] bg-white text-black font-[Arial,Helvetica,sans-serif]">
                    <option>Tùy chọn tìm kiếm</option>
                  </select>
                  <select className="w-full sm:w-auto sm:flex-[0_0_30%] px-3 border border-[#d8d8d8] rounded-sm text-[13px] h-[34px] text-[#666] bg-white/70 font-[Arial,Helvetica,sans-serif]">
                    <option></option>
                  </select>
                  <select className="w-full sm:w-auto sm:flex-[0_0_30%] px-3 border border-[#d8d8d8] rounded-sm text-[13px] h-[34px] text-[#666] bg-white/70 font-[Arial,Helvetica,sans-serif]">
                    <option>Tất cả</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Tìm gian hàng hoặc người bán"
                  className="w-full px-3 border border-[#d8d8d8] rounded-sm text-[13px] h-[36px] mb-2 bg-white text-[#444] placeholder:text-[#8e97a3] font-[Arial,Helvetica,sans-serif]"
                />
                <Button 
                  variant="success" 
                  className="w-full sm:w-[130px] mx-auto block text-[14px] h-[36px] font-semibold font-[Arial,Helvetica,sans-serif]"
                >
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </section>

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
