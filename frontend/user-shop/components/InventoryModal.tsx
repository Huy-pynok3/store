'use client'

import { FormEvent, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '@/lib/api'
import { InventoryItem, ShopListing } from '../types'

interface InventoryModalProps {
  shop: ShopListing
  canOpenProductDetail?: boolean
  onClose: () => void
}

const mockInventory: InventoryItem[] = []

function formatPrice(value: number) {
  return value.toLocaleString('vi-VN')
}

export default function InventoryModal({ shop, canOpenProductDetail = false, onClose }: InventoryModalProps) {
  const router = useRouter()
  const [usePrivateWarehouse, setUsePrivateWarehouse] = useState(false)
  const [items, setItems] = useState<InventoryItem[]>(mockInventory)
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [previewItemName, setPreviewItemName] = useState('')
  const [previewItemPrice, setPreviewItemPrice] = useState<number>(0)

  // Warehouse config state
  const [apiUrl, setApiUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState('')
  const [testData, setTestData] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const shopTypeBadge = shop.shopType || 'Sản phẩm'
  const badgeColor = shopTypeBadge === 'Dịch vụ' ? 'bg-[#3f72c8]' : 'bg-[#20a464]'

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return

    const normalizedName = newName.trim()
    const normalizedPrice = Number(newPrice) || 0
    if (editingItemId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                name: normalizedName,
                price: normalizedPrice,
              }
            : item
        )
      )
      setEditingItemId(null)
    } else {
      const item: InventoryItem = {
        id: `inv-${Date.now()}`,
        name: normalizedName,
        price: normalizedPrice,
        status: 'active',
        stock: 0,
      }
      setItems((prev) => [...prev, item])
    }
    setPreviewItemName(normalizedName)
    setPreviewItemPrice(normalizedPrice)

    setNewName('')
    setNewPrice('')
  }

  function handleDelete(id: string) {
    setItems((prev) => {
      const remainingItems = prev.filter((item) => item.id !== id)
      if (remainingItems.length > 0) {
        const lastItem = remainingItems[remainingItems.length - 1]
        setPreviewItemName(lastItem.name)
        setPreviewItemPrice(lastItem.price)
      } else {
        setPreviewItemName('')
        setPreviewItemPrice(0)
      }
      return remainingItems
    })
    if (editingItemId === id) {
      setEditingItemId(null)
      setNewName('')
      setNewPrice('')
    }
  }

  function handleEdit(item: InventoryItem) {
    setEditingItemId(item.id)
    setNewName(item.name)
    setNewPrice(String(item.price))
  }

  function handleOpenItemDetail(item: InventoryItem) {
    const detailHref = `/quan-ly-cua-hang/mat-hang?shopName=${encodeURIComponent(shop.name)}&itemName=${encodeURIComponent(item.name)}`
    onClose()
    router.push(detailHref)
  }

  function handleOpenProductDetail() {
    const detailHref = `/san-pham/${shop.id}?preview=new-shop-empty&shopName=${encodeURIComponent(shop.name)}&itemName=${encodeURIComponent(previewItemName)}&itemPrice=${previewItemPrice}`
    onClose()
    router.push(detailHref)
  }

  const handleTestConnection = useCallback(async () => {
    if (!apiUrl.trim()) {
      setTestStatus('error')
      setTestMessage('Vui lòng nhập API URL')
      return
    }

    setTestStatus('testing')
    setTestMessage('')
    setTestData(null)

    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS.warehouseTestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiUrl: apiUrl.trim(),
          apiKey: apiKey.trim() || undefined,
        }),
      })
      const data = await res.json()
      setTestStatus(data.success ? 'success' : 'error')
      setTestMessage(data.message)
      if (data.data) setTestData(data.data)
    } catch {
      setTestStatus('error')
      setTestMessage('Không thể kết nối đến server')
    }
  }, [apiUrl, apiKey])

  const handleSaveWarehouseConfig = useCallback(async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await fetch(API_ENDPOINTS.PRODUCTS.warehouseConfig(shop.id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          usePrivateWarehouse,
          warehouseApiUrl: usePrivateWarehouse ? apiUrl : null,
          warehouseApiKey: usePrivateWarehouse && apiKey ? apiKey : null,
        }),
      })
    } catch {
      // Will be handled when real product IDs are used
    } finally {
      setSaving(false)
    }
  }, [usePrivateWarehouse, apiUrl, apiKey, shop.id])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-[760px] rounded-md border border-[#d7dde8] bg-[#f7f9fc] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[#e1e6ef] px-5 py-3">
          <h3 className="text-[16px] font-semibold leading-[1.2] text-[#2d3645]">Quản lý mặt hàng/kho</h3>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {/* Shop info */}
          <div className="mb-3 flex items-center gap-2 text-[15px] text-[#4b5563]">
            <span>Gian hàng:</span>
            <span className={`rounded px-2 py-0.5 text-[12px] font-semibold text-white ${badgeColor}`}>
              {shopTypeBadge}
            </span>
            {canOpenProductDetail ? (
              <button
                type="button"
                onClick={handleOpenProductDetail}
                className="font-semibold text-[#4f7da8] hover:text-[#3e6e9a]"
              >
                {shop.name}
              </button>
            ) : (
              <span className="font-semibold text-[#4b5563]">{shop.name}</span>
            )}
          </div>

          {/* Private warehouse checkbox */}
          <label className="mb-4 flex items-start gap-2 text-[15px] text-[#4b5563]">
            <input
              type="checkbox"
              checked={usePrivateWarehouse}
              onChange={() => setUsePrivateWarehouse((v) => !v)}
              className="mt-0.5"
            />
            <span>
              Sử dụng kho hàng riêng{' '}
              <span className="text-[#6b7280]">
                (Thiết lập này yêu cầu bạn có server kho hàng riêng và có API lấy hàng cung cấp cho sàn)
              </span>
            </span>
          </label>

          {usePrivateWarehouse ? (
            /* ===== Private Warehouse Config ===== */
            <div className="space-y-4">
              <div className="rounded-md border border-[#dbeafe] bg-[#eff6ff] p-4">
                <h4 className="mb-3 text-sm font-semibold text-[#1e40af]">
                  <i className="fa-solid fa-server mr-2" aria-hidden="true" />
                  Cấu hình API kho hàng riêng
                </h4>

                <div className="space-y-3">
                  <label className="block space-y-1">
                    <span className="text-sm font-medium text-[#374151]">API URL</span>
                    <input
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://example.com/api/products.php?api_key=YOUR_KEY"
                      className="w-full rounded border border-[#d6dbe4] bg-white px-3 py-2 text-sm outline-none focus:border-[#93b2da]"
                    />
                    <p className="text-xs text-[#6b7280]">
                      Nhập URL đầy đủ bao gồm api_key nếu có (VD: https://example.com/api?api_key=xxx)
                    </p>
                  </label>

                  <label className="block space-y-1">
                    <span className="text-sm font-medium text-[#374151]">
                      API Key <span className="font-normal text-[#9ca3af]">(tùy chọn — chỉ cần nếu server dùng Bearer token)</span>
                    </span>
                    <div className="flex gap-2">
                      <input
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        type={showApiKey ? 'text' : 'password'}
                        placeholder="Để trống nếu api_key đã nằm trong URL"
                        className="flex-1 rounded border border-[#d6dbe4] bg-white px-3 py-2 text-sm outline-none focus:border-[#93b2da]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey((v) => !v)}
                        className="rounded border border-[#d6dbe4] bg-[#f8fafc] px-3 py-2 text-sm text-[#374151] hover:bg-[#eef1f6]"
                        aria-label={showApiKey ? 'Ẩn API key' : 'Hiện API key'}
                      >
                        <i className={`fa-solid ${showApiKey ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                      </button>
                    </div>
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                    className="inline-flex items-center gap-2 rounded bg-[#3f72c8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#305fae] disabled:opacity-60"
                  >
                    {testStatus === 'testing' ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                        Đang kiểm tra...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-plug" aria-hidden="true" />
                        Kiểm tra kết nối
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveWarehouseConfig}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded bg-[#19a56f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#168f60] disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
                        Lưu cấu hình
                      </>
                    )}
                  </button>

                  {testMessage && (
                    <span
                      className={`text-sm font-medium ${testStatus === 'success' ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}
                    >
                      <i
                        className={`fa-solid ${testStatus === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} mr-1`}
                        aria-hidden="true"
                      />
                      {testMessage}
                    </span>
                  )}
                </div>
              </div>

              {/* Show API response data preview */}
              {testData && (
                <div className="rounded-md border border-[#d1fae5] bg-[#ecfdf5] p-4">
                  <h4 className="mb-2 text-sm font-semibold text-[#065f46]">
                    <i className="fa-solid fa-database mr-2" aria-hidden="true" />
                    Dữ liệu trả về từ API
                  </h4>
                  <pre className="max-h-[200px] overflow-auto rounded bg-white p-3 text-xs text-[#374151]">
                    {JSON.stringify(testData, null, 2)}
                  </pre>
                </div>
              )}

              {/* API spec guide */}
              <div className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm text-[#374151]">
                <p className="mb-2 font-semibold">Hỗ trợ 2 kiểu xác thực:</p>
                <ul className="ml-4 list-disc space-y-1.5 text-[#4b5563]">
                  <li>
                    <strong>Query parameter:</strong> API key nằm trong URL{' '}
                    <code className="rounded bg-[#e5e7eb] px-1.5 py-0.5 text-xs">
                      ?api_key=YOUR_KEY
                    </code>
                  </li>
                  <li>
                    <strong>Bearer token:</strong> API key gửi qua header{' '}
                    <code className="rounded bg-[#e5e7eb] px-1.5 py-0.5 text-xs">
                      Authorization: Bearer YOUR_KEY
                    </code>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* ===== Manual Inventory Management ===== */
            <>
              {/* Inventory table */}
              <div className="mb-3 overflow-x-auto rounded border border-[#dbe2ec]">
                <table className="w-full border-collapse text-left text-[15px] text-[#3f4a5a]">
                  <thead>
                    <tr className="bg-[#eef2f7] text-[#4c5666]">
                      <th className="px-3 py-2 font-semibold">Tên mặt hàng</th>
                      <th className="px-3 py-2 font-semibold">Giá</th>
                      <th className="px-3 py-2 font-semibold">Trạng thái</th>
                      <th className="px-3 py-2 font-semibold">Tồn kho</th>
                      <th className="px-3 py-2 font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-5 text-center text-[#9ca3af]">
                          Chưa có mặt hàng nào
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className="border-t border-[#e5e7eb]">
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">{formatPrice(item.price)}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-[11px] font-bold text-white ${
                                item.status === 'active' ? 'bg-[#1ea672]' : 'bg-[#6b7280]'
                              }`}
                            >
                              {item.status === 'active' ? 'A' : 'B'}
                            </span>
                          </td>
                          <td className="px-3 py-2">{item.stock}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                className="text-[#2f6fb3] hover:text-[#245b95]"
                                aria-label={`Sửa ${item.name}`}
                              >
                                <i className="fa-solid fa-pen-to-square text-[24px]" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenItemDetail(item)}
                                className="text-[#2f6fb3] hover:text-[#245b95]"
                                aria-label={`Mở chi tiết ${item.name}`}
                              >
                                <i className="fa-solid fa-circle-plus text-[24px]" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="text-[#2f6fb3] hover:text-[#245b95]"
                                aria-label={`Xóa ${item.name}`}
                              >
                                <i className="fa-solid fa-trash-can text-[24px]" aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add item form */}
              <form onSubmit={handleAdd} className="mb-4">
                <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
                  <div>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Tên mặt hàng"
                      className="w-full rounded border border-[#d6dbe4] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#93b2da]"
                    />
                  </div>
                  <div>
                    <input
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Giá tiền"
                      type="number"
                      min="0"
                      className="w-full rounded border border-[#d6dbe4] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#93b2da]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-3 rounded bg-[#3f72c8] px-5 py-1.5 text-[15px] font-semibold text-white hover:bg-[#315ea7]"
                >
                  {editingItemId ? 'Cập nhật' : 'Thêm'}
                </button>
              </form>

              {/* Notes */}
              <div className="text-[15px] text-[#374151]">
                <p className="font-semibold">*Lưu ý:</p>
                <ul className="ml-4 mt-1 list-disc space-y-1 text-[#374151]">
                  <li>
                    Với những dịch vụ có giá cố định (như giá/ lượt like, share, comment...) bạn phải để giá công khai.
                  </li>
                  <li>
                    Nhập vào giá bằng <strong>0</strong> đối với dịch vụ có giá thỏa thuận (như code tool, đồ họa...),
                    khi khách đặt hàng sẽ phải nhập vào giá 2 bên đã thỏa thuận.
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#e5e7eb] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-[#7b8ba2] px-4 py-1.5 text-[15px] font-semibold text-white hover:bg-[#66768d]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
