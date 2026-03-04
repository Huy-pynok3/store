import { ShopListing } from '../types'

interface ShopManagementTableProps {
  items: ShopListing[]
  onEdit: (item: ShopListing) => void
}

function formatPrice(value: number) {
  return value.toLocaleString('vi-VN')
}

export default function ShopManagementTable({ items, onEdit }: ShopManagementTableProps) {
  return (
    <section className="rounded-md border border-[#dfe4ef] bg-white p-4 shadow-sm">
      <h2 className="text-[32px] font-semibold text-[#1f2937]">Gian hàng</h2>
      <p className="mb-4 mt-1 text-base text-[#4b5563]">Bạn được tạo tối đa 20 gian hàng.</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm text-[#374151]">
          <thead>
            <tr className="bg-[#f3f6fb] text-[#4b5563]">
              <th className="px-3 py-3 font-semibold">Thao tác</th>
              <th className="px-3 py-3 font-semibold">Tên gian hàng</th>
              <th className="px-3 py-3 font-semibold">Loại</th>
              <th className="px-3 py-3 font-semibold">Trung</th>
              <th className="px-3 py-3 font-semibold">Reseller</th>
              <th className="px-3 py-3 font-semibold">Đơn giá</th>
              <th className="px-3 py-3 font-semibold">Sàn</th>
              <th className="px-3 py-3 font-semibold">Kho</th>
              <th className="px-3 py-3 font-semibold">Ngày tạo</th>
              <th className="px-3 py-3 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-[#e5e7eb] align-top">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3 text-[#4b6da8]">
                    <button
                      type="button"
                      className="hover:text-[#284c8e]"
                      aria-label={`Edit ${item.name}`}
                      onClick={() => onEdit(item)}
                    >
                      <i className="fa-regular fa-pen-to-square text-lg" aria-hidden="true" />
                    </button>
                    <button type="button" className="hover:text-[#284c8e]" aria-label={`Open folder ${item.name}`}>
                      <i className="fa-regular fa-folder-open text-lg" aria-hidden="true" />
                    </button>
                  </div>
                </td>
                <td className="max-w-[420px] px-3 py-3 leading-6 text-[#334155]">{item.name}</td>
                <td className="px-3 py-3">{item.category}</td>
                <td className="px-3 py-3">
                  <i className="fa-solid fa-circle-xmark text-[#c77a3b]" aria-hidden="true" />
                  <span className="sr-only">{item.duplicateRate}%</span>
                </td>
                <td className="px-3 py-3">
                  {item.resellerEnabled ? (
                    <i className="fa-solid fa-circle-check text-[#1fa96f]" aria-hidden="true" />
                  ) : (
                    <i className="fa-solid fa-circle-xmark text-[#c77a3b]" aria-hidden="true" />
                  )}
                </td>
                <td className="px-3 py-3">{formatPrice(item.unitPrice)} d</td>
                <td className="px-3 py-3">{item.discountPercent}%</td>
                <td className="px-3 py-3">{item.stock}</td>
                <td className="px-3 py-3">{item.createdAt}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex rounded bg-[#1ea672] px-3 py-1 text-xs font-semibold text-white">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
