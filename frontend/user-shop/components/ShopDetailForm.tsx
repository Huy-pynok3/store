'use client'

import { FormEvent, useMemo, useState } from 'react'
import ShopRichTextEditor from './ShopRichTextEditor'
import { ShopListing } from '../types'

interface ShopDetailFormProps {
  item: ShopListing
  onBack: () => void
}

export default function ShopDetailForm({ item, onBack }: ShopDetailFormProps) {
  const [shopName, setShopName] = useState(item.name)
  const [shopType, setShopType] = useState('Tài khoản')
  const [productType, setProductType] = useState('Tài khoản FB (2%)')
  const [refundRate, setRefundRate] = useState('0.0')
  const [status, setStatus] = useState(item.status)
  const [allowReseller, setAllowReseller] = useState(item.resellerEnabled)
  const [uniqueProduct, setUniqueProduct] = useState(true)
  const [usePrivateWarehouse, setUsePrivateWarehouse] = useState(false)
  const [shortDescription, setShortDescription] = useState(item.name)
  const [detailDescription, setDetailDescription] = useState(
    '<p>- Số ngày tạo: tầm 1-3 tháng</p><p>- Việt, Name random</p><p>- Định dạng xuất: UID | Pass | 2FA | Email | Pass Mail</p><p><strong>Vui lòng mua ít để dùng và kiểm tra chất lượng.</strong></p>'
  )

  const formTitle = useMemo(() => 'Chi tiết gian hàng', [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <section className="rounded-md border border-[#dfe4ef] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-[#1f2937]">{formTitle}</h2>
        <button
          type="button"
          className="rounded bg-[#19a56f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#168f60]"
        >
          Chỉnh sửa mặt hàng
        </button>
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
            <span className="font-medium">Loại gian hàng</span>
            <select
              value={shopType}
              onChange={(event) => setShopType(event.target.value)}
              className="w-full rounded border border-[#d6dbe4] bg-[#f8fafc] px-3 py-2 outline-none focus:border-[#93b2da]"
            >
              <option>Tài khoản</option>
              <option>Dịch vụ</option>
            </select>
          </label>
        </div>

        <label className="space-y-1 block">
          <span className="font-medium">Loại sản phẩm - Chiết khấu cho sàn</span>
          <select
            value={productType}
            onChange={(event) => setProductType(event.target.value)}
            className="w-full rounded border border-[#d6dbe4] bg-[#f8fafc] px-3 py-2 outline-none focus:border-[#93b2da]"
          >
            <option>Tài khoản FB (2%)</option>
            <option>Email (2%)</option>
          </select>
        </label>

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
            Cập nhật
          </button>
        </div>
      </form>
    </section>
  )
}
