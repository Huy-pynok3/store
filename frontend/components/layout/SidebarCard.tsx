import { Badge, Card, StarRating } from '../ui'

interface SidebarCardProps {
  warehouse: string
  priceRange: string
  productType: string
  title: string
  rating: number
  reviews: number
  sold: number
  complaints: string
  seller: string
  category: string
  icon: 'facebook' | 'proxy'
  iconBgColor?: string
  features: string[]
  showDownloadButton?: boolean
}

export default function SidebarCard({
  warehouse,
  priceRange,
  productType,
  title,
  rating,
  reviews,
  sold,
  complaints,
  seller,
  category,
  icon,
  iconBgColor,
  features,
  showDownloadButton = true,
}: SidebarCardProps) {
  return (
    <Card className="rounded-sm p-3">
      <div
        className="mx-auto mb-3 h-[156px] w-[156px] rounded-full flex items-center justify-center"
        style={{ backgroundColor: iconBgColor || '#446cb3' }}
      >
        {icon === 'facebook' ? (
          <div className="h-[82px] w-[82px] rounded-[6px] bg-white flex items-center justify-center">
            <i className="fab fa-facebook-f text-[70px] leading-none text-[#446cb3]"></i>
          </div>
        ) : (
          <div className="h-[82px] w-[82px] rounded-[6px] bg-white flex items-center justify-center">
            <i className="fas fa-globe text-[44px] leading-none text-[#446cb3]"></i>
          </div>
        )}
      </div>

      <p className="mb-1 text-center text-[13px] leading-tight text-[#202020] break-words">
        Tồn kho: <span className="font-semibold text-[#2a84d7]">{warehouse}</span>
      </p>
      <p className="mb-2 text-center text-[16px] leading-none font-bold text-[#2d2d2d] break-words">{priceRange}</p>

      <div className="mb-1.5">
        <Badge variant="success" size="xs" className="uppercase tracking-wide">
          {productType}
        </Badge>
      </div>

      <h3 className="mb-2 text-[17px] leading-tight font-bold uppercase text-[#2d2d2d] break-words">{title}</h3>

      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#6d6d6d] flex-wrap">
        <StarRating rating={rating} size="xs" />
        <span className="break-words">{reviews} Reviews</span>
      </div>

      <p className="mb-1 text-[12px] leading-tight text-[#6a6a6a] break-words">
        Đã bán: {sold.toLocaleString()} | Khiếu nại: {complaints}
      </p>
      <p className="mb-1 text-[12px] text-[#6a6a6a] break-words">
        Người bán: <span className="font-medium text-[#2f9d59]">{seller}</span>
      </p>
      <p className="mb-1.5 text-[12px] text-[#6a6a6a] break-words">Sản phẩm: {category}</p>

      {features.length > 0 && (
        <ul className="mb-2 list-disc pl-4 text-[11px] leading-[1.3] text-[#585858]">
          {features.slice(0, 5).map((feature, index) => (
            <li key={index} className="break-words">{feature}</li>
          ))}
        </ul>
      )}

      {showDownloadButton && (
        <button className="inline-flex items-center gap-1 text-[14px] leading-none text-[#f2b005]">
          <i className="fas fa-star"></i>
          <span className="bg-[#ffcd00] px-2 py-0.5 text-[12px] font-bold text-black">Tài trợ</span>
        </button>
      )}
    </Card>
  )
}
