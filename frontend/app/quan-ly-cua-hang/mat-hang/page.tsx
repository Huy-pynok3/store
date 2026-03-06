'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import UserShopSidebar from '@/user-shop/components/UserShopSidebar'

const recentUploadRows = [
  { itemName: 'Clone 50 - 500bb > 8 Tháng', fileName: 'tessss.txt.log', uploadedAt: '24/04/2024 23:03', result: 'TOTAL:1|SUCCESS:0|ERROR:1', status: 'Thành công' },
  { itemName: 'Clone 50 - 500bb > 8 Tháng', fileName: 'test file cuoi.txt.log', uploadedAt: '24/04/2024 22:58', result: 'TOTAL:3|SUCCESS:1|ERROR:2', status: 'Thành công' },
  { itemName: 'Clone 50 - 500bb > 8 Tháng', fileName: 'test file 9.txt.log', uploadedAt: '24/04/2024 22:56', result: 'TOTAL:2|SUCCESS:0|ERROR:2', status: 'Thành công' },
]

function ShopItemManagementPageContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const shopName = searchParams.get('shopName') || 'Gian hàng mới'
  const itemName = searchParams.get('itemName') || 'Mặt hàng mới'

  return (
    <main className="min-h-screen bg-[#cfd8e6] md:flex">
      <UserShopSidebar activeSection="shop" />

      <section className="flex-1">
        <div className="flex h-[74px] items-center justify-between border-b border-[#d8dfec] bg-white px-5 md:px-8">
          <button type="button" className="text-[#55637a]" aria-label="Toggle sidebar">
            <i className="fa-solid fa-bars text-lg" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-4 text-[#55637a]">
            <i className="fa-regular fa-comment-dots text-xl" aria-hidden="true" />
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
          <section className="rounded-md border border-[#dbe2ec] bg-white shadow-sm">
            <div className="border-b border-[#e6ebf2] px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-[26px] font-semibold leading-[1.25] text-[#1f2937]">
                  Gian hàng: <span className="font-bold">{shopName}</span>
                </h1>
                <span className="rounded bg-[#20a464] px-4 py-1.5 text-[14px] font-semibold text-white">
                  Mặt hàng: {itemName}
                </span>
              </div>
            </div>

            <div className="border-b border-[#e6ebf2] px-5 py-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-2">
                  <label className="block text-[14px] text-[#374151]">Chọn file(txt)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      className="block w-full rounded border border-[#d6dbe4] bg-white px-3 py-2 text-sm text-[#374151] file:mr-3 file:rounded file:border-0 file:bg-[#e5eaf3] file:px-3 file:py-1 file:text-sm file:text-[#374151]"
                    />
                    <button
                      type="button"
                      className="shrink-0 rounded bg-[#3f72c8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2f5fae]"
                    >
                      Tải lên
                    </button>
                  </div>
                </div>

                <div className="text-[13px] text-[#666f7e]">
                  <p className="mb-1 font-semibold text-[#8b6b57]">
                    Chú ý: File tải lên mỗi dòng sẽ là 1 sản phẩm. Cấu trúc dòng:
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Email: username@gmail.com|password|.....</li>
                    <li>Phần mềm: xxxx....</li>
                    <li>Tài khoản: username|password and(or) anything else</li>
                    <li>Loại khác: xxxx....</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-b border-[#e6ebf2] px-5 py-4">
              <h2 className="text-[24px] font-semibold text-[#2b3340]">File tải lên gần nhất</h2>
              <div className="mt-3 overflow-x-auto rounded border border-[#dbe2ec]">
                <table className="w-full border-collapse text-left text-[13px] text-[#3f4a5a]">
                  <thead>
                    <tr className="bg-[#eef2f7] text-[#4c5666]">
                      <th className="px-3 py-2 font-semibold">Tên mặt hàng</th>
                      <th className="px-3 py-2 font-semibold">Tên file</th>
                      <th className="px-3 py-2 font-semibold">Ngày upload</th>
                      <th className="px-3 py-2 font-semibold">Kết quả</th>
                      <th className="px-3 py-2 text-right font-semibold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploadRows.map((row) => (
                      <tr key={`${row.fileName}-${row.uploadedAt}`} className="border-t border-[#e5e7eb]">
                        <td className="px-3 py-2">{row.itemName}</td>
                        <td className="px-3 py-2 text-[#4e7db2] underline">{row.fileName}</td>
                        <td className="px-3 py-2">{row.uploadedAt}</td>
                        <td className="px-3 py-2">{row.result}</td>
                        <td className="px-3 py-2 text-right">
                          <span className="rounded bg-[#2ca55f] px-2 py-0.5 text-[12px] font-semibold text-white">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-5 py-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[24px] font-semibold text-[#2b3340]">Sản phẩm đang bán</h2>
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded bg-[#c5642c] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#ab5525]">
                    Xóa toàn bộ
                  </button>
                  <button type="button" className="rounded bg-[#2c9a4b] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#258241]">
                    Tải về SP chưa bán
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded border border-[#dbe2ec]">
                <table className="w-full border-collapse text-left text-[14px] text-[#3f4a5a]">
                  <thead>
                    <tr className="bg-[#eef2f7] text-[#4c5666]">
                      <th className="px-3 py-2 font-semibold">STT</th>
                      <th className="px-3 py-2 font-semibold">Sản phẩm</th>
                      <th className="px-3 py-2 font-semibold">Ngày tạo</th>
                      <th className="px-3 py-2 font-semibold">Ngày bán</th>
                      <th className="px-3 py-2 font-semibold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#e5e7eb]">
                      <td colSpan={5} className="px-3 py-4 text-center text-[#7b8494]">
                        No data available in table
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default function ShopItemManagementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#cfd8e6] flex items-center justify-center">Loading...</div>}>
      <ShopItemManagementPageContent />
    </Suspense>
  )
}
