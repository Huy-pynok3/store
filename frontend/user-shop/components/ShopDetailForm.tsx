'use client'

import { FormEvent, useMemo, useState } from 'react'
import ShopRichTextEditor from './ShopRichTextEditor'
import { ShopListing } from '../types'

interface ShopDetailFormProps {
  item: ShopListing
  onBack: () => void
  onInventory: () => void
  onSubmitSuccess: (shopData: Partial<ShopListing>) => void
}

export default function ShopDetailForm({ item, onBack, onInventory, onSubmitSuccess }: ShopDetailFormProps) {
  const isCreateMode = item.id === 'new-shop'
  const [shopName, setShopName] = useState(item.name)
  const [shopType, setShopType] = useState<'product' | 'service' | ''>('')
  const [shopCategory, setShopCategory] = useState('')
  const [productType, setProductType] = useState('')
  const [refundRate, setRefundRate] = useState('0.0')
  const [status, setStatus] = useState(item.status)
  const [allowReseller, setAllowReseller] = useState(item.resellerEnabled)
  const [uniqueProduct] = useState(true)
  const [usePrivateWarehouse, setUsePrivateWarehouse] = useState(false)
  const [shortDescription, setShortDescription] = useState(item.name)
  const [detailDescription, setDetailDescription] = useState(
    '<p>- Số ngày tạo: tầm 1-3 tháng</p><p>- Việt, Name random</p><p>- Định dạng xuất: UID | Pass | 2FA | Email | Pass Mail</p><p><strong>Vui lòng mua ít để dùng và kiểm tra chất lượng.</strong></p>'
  )

  const formTitle = useMemo(() => (isCreateMode ? 'Thêm gian hàng' : 'Chi tiết gian hàng'), [isCreateMode])
  const submitLabel = isCreateMode ? 'Tạo gian hàng' : 'Cập nhật'

  // Category options based on shop type
  const categoryOptions = useMemo(() => {
    if (shopType === 'product') {
      return [
        { value: 'email', label: 'Email' },
        { value: 'product_software', label: 'Phần mềm' },
        { value: 'account', label: 'Tài khoản' },
        { value: 'product_other', label: 'Khác' }
      ]
    } else if (shopType === 'service') {
      return [
        { value: 'engagement', label: 'Tương tác' },
        { value: 'service_software', label: 'Phần mềm' },
        { value: 'blockchain', label: 'Blockchain' },
        { value: 'service_other', label: 'Khác' }
      ]
    }
    return []
  }, [shopType])

  // Product type options based on category
  const productTypeOptions = useMemo(() => {
    switch (shopCategory) {
      case 'email':
        return [
          { value: 'gmail', label: 'Gmail (2%)' },
          { value: 'hotmail', label: 'Hotmail (2%)' },
          { value: 'outlookmail', label: 'Outlook Mail (2%)' },
          { value: 'iuumail', label: 'Iuu Mail (2%)' },
          { value: 'domainmail', label: 'Domain Mail (2%)' },
          { value: 'yahoomail', label: 'Yahoo Mail (2%)' },
          { value: 'protonmail', label: 'Proton Mail (2%)' },
          { value: 'other_mail', label: 'Email khác (2%)' }
        ]
      case 'product_software':
        return [
          { value: 'windows_software', label: 'Phần mềm Windows (3%)' },
          { value: 'mac_software', label: 'Phần mềm Mac (3%)' },
          { value: 'mobile_app', label: 'Ứng dụng Mobile (3%)' },
          { value: 'web_app', label: 'Ứng dụng Web (3%)' },
          { value: 'other_software', label: 'Phần mềm khác (3%)' }
        ]
      case 'account':
        return [
          { value: 'social_account', label: 'Tài khoản mạng xã hội (2%)' },
          { value: 'gaming_account', label: 'Tài khoản game (2%)' },
          { value: 'streaming_account', label: 'Tài khoản streaming (2%)' },
          { value: 'other_account', label: 'Tài khoản khác (2%)' }
        ]
      case 'product_other':
        return [
          { value: 'general_other', label: 'Sản phẩm khác (2%)' }
        ]
      case 'engagement':
        return [
          { value: 'facebook_engagement', label: 'Tương tác Facebook (5%)' },
          { value: 'instagram_engagement', label: 'Tương tác Instagram (5%)' },
          { value: 'tiktok_engagement', label: 'Tương tác TikTok (5%)' },
          { value: 'youtube_engagement', label: 'Tương tác YouTube (5%)' },
          { value: 'other_engagement', label: 'Tương tác khác (5%)' }
        ]
      case 'service_software':
        return [
          { value: 'custom_software_dev', label: 'Phát triển phần mềm (10%)' },
          { value: 'api_integration', label: 'Tích hợp API (10%)' },
          { value: 'other_service_software', label: 'Dịch vụ phần mềm khác (10%)' }
        ]
      case 'blockchain':
        return [
          { value: 'blockchain_dev', label: 'Phát triển Blockchain (10%)' },
          { value: 'smart_contract', label: 'Smart Contract (10%)' },
          { value: 'nft_service', label: 'Dịch vụ NFT (10%)' },
          { value: 'other_blockchain', label: 'Blockchain khác (10%)' }
        ]
      case 'service_other':
        return [
          { value: 'general_other', label: 'Dịch vụ khác (5%)' }
        ]
      default:
        return []
    }
  }, [shopCategory])

  // Reset category when shop type changes
  const handleShopTypeChange = (newType: 'product' | 'service' | '') => {
    setShopType(newType)
    // Reset category and product type when shop type changes
    setShopCategory('')
    setProductType('')
  }

  // Reset product type when category changes
  const handleCategoryChange = (newCategory: string) => {
    setShopCategory(newCategory)
    // Reset product type when category changes
    setProductType('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmitSuccess({
      name: shopName.trim() || item.name,
      category: shopCategory || item.category,
      shopType: shopType === 'service' ? 'Dịch vụ' : 'Sản phẩm',
      status,
      resellerEnabled: allowReseller,
    })
  }

  return (
    <section className="rounded-md border border-[#dfe4ef] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-[#1f2937]">{formTitle}</h2>
        {!isCreateMode && (
          <button
            type="button"
            onClick={onInventory}
            className="rounded bg-[#19a56f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#168f60]"
          >
            Chỉnh sửa mặt hàng
          </button>
        )}
      </div>

      <form className="space-y-4 text-sm text-[#374151]" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="font-medium">Tên gian hàng</span>
            <input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
              className="w-full rounded border border-[#d6dbe4] bg-[#f8fafc] px-3 py-2 outline-none focus:border-[#93b2da]"
            />
          </label>
          <label className="space-y-1">
            <span className="font-medium">Loại hình kinh doanh</span>
            <select
              value={shopType}
              onChange={(event) => handleShopTypeChange(event.target.value as 'product' | 'service' | '')}
              className="w-full rounded border border-[#d6dbe4] bg-[#f8fafc] px-3 py-2 outline-none focus:border-[#93b2da]"
            >
              <option value="">Chọn ...</option>
              <option value="product">Bán sản phẩm</option>
              <option value="service">Bán dịch vụ</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 block">
            <span className="font-medium">Loại gian hàng</span>
            <select
              value={shopCategory}
              onChange={(event) => handleCategoryChange(event.target.value)}
              disabled={!shopType}
              className="w-full rounded border border-[#d6dbe4] bg-[#f8fafc] px-3 py-2 outline-none focus:border-[#93b2da] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Chọn ...</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 block">
            <span className="font-medium">Loại sản phẩm - Chiết khấu cho sàn</span>
            <select
              value={productType}
              onChange={(event) => setProductType(event.target.value)}
              disabled={!shopCategory}
              className="w-full rounded border border-[#d6dbe4] bg-[#f8fafc] px-3 py-2 outline-none focus:border-[#93b2da] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Chọn ...</option>
              {productTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-1 block">
          <span className="font-medium">Đánh giá hoàn tiền (%)</span>
          <input
            value={refundRate}
            onChange={(event) => setRefundRate(event.target.value)}
            className="w-full rounded border border-[#d6dbe4] bg-white px-3 py-2 outline-none focus:border-[#93b2da]"
          />
        </label>

        <label className="space-y-1 block">
          <span className="font-medium">Trạng thái</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full max-w-[420px] rounded border border-[#d6dbe4] bg-white px-3 py-2 outline-none focus:border-[#93b2da]"
          >
            <option>A - Đang bán</option>
            <option>B - Tạm dừng</option>
          </select>
        </label>

        <div className="space-y-2 text-[#374151]">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={allowReseller} onChange={() => setAllowReseller((v) => !v)} />
            <span>Bạn có muốn cho reseller bán hàng không?</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={uniqueProduct} disabled className="cursor-not-allowed opacity-70" />
            <span className="text-[#6b7280]">
              Sản phẩm không trùng lặp{' '}
              <span className="italic">(Cam kết sản phẩm chỉ được bán ra 1 lần và duy nhất trên hệ thống)</span>
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={usePrivateWarehouse} onChange={() => setUsePrivateWarehouse((v) => !v)} />
            <span>
              Sử dụng kho hàng riêng{' '}
              <span className="italic">(Hãng sẽ không tải trực tiếp lên TaphoamMMO mà sử dụng API lấy hàng từ kho của bạn)</span>
            </span>
          </label>
        </div>

        <label className="space-y-1 block">
          <span className="font-medium">Mô tả ngắn</span>
          <input
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            className="w-full rounded border border-[#d6dbe4] bg-white px-3 py-2 outline-none focus:border-[#93b2da]"
          />
        </label>

        <div className="space-y-1">
          <span className="font-medium">Mô tả chi tiết</span>
          <ShopRichTextEditor value={detailDescription} onChange={setDetailDescription} />
        </div>

        <label className="space-y-1 block">
          <span className="font-medium">Ảnh gian hàng (kích thước lớn hơn 320px)</span>
          <input type="file" className="w-full rounded border border-[#d6dbe4] bg-white px-3 py-2 text-sm" />
        </label>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded bg-[#6b7280] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5f6673]"
          >
            Quay lại
          </button>
          <button type="submit" className="rounded bg-[#19a56f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#168f60]">
            {submitLabel}
          </button>
        </div>
      </form>
    </section>
  )
}
