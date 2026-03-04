'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageContainer, Card, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from '@/components/ui'

export default function OrderHistoryPage() {
  const [searchCode, setSearchCode] = useState('')
  const [filterType, setFilterType] = useState('all')

  const orders = [
    {
      id: 'ZMLFSNUO4T',
      date: '10/08/2024 12:30',
      store: 'TIKTOK VIỆT GIÁ RẺ SIÊU TRÂU',
      product: 'Tiktok Việt 10-20Days Qua Spam Tym TLC | Có Cookie',
      seller: 'phammahhung',
      quantity: 1,
      price: 800,
      discount: 0,
      total: 800,
      refund: '-',
      status: 'Tạm giữ tiền',
      statusColor: 'bg-blue-500'
    },
    {
      id: 'TSXDJXUEKM',
      date: '06/08/2024 00:23',
      store: 'TÀI KHOẢN TIKTOK VIỆT CLONE TRÊN 8 TUẦN- có Cookie',
      product: 'TÀI KHOẢN TIKTOK VIỆT CLONE THÁNG 11-2023(mallllmllmalllIDIMK',
      seller: 'nguyenbongoc2021',
      quantity: 1,
      price: 2000,
      discount: 0,
      total: 2000,
      refund: '-',
      status: 'Hoàn thành',
      statusColor: 'bg-green-500'
    }
  ]

  return (
    <PageContainer>
      <Card className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Đơn hàng đã mua</h1>
        
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <Input
            placeholder="Nhập mã đơn hàng"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full md:w-80"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#21abc6]"
          >
            <option value="all">Mã đơn hàng</option>
            <option value="pending">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <Button variant="success" className="w-full md:w-auto">Tìm đơn hàng</Button>
        </div>

        <div className="py-2">
          <h3 className="font-bold text-red-400 mb-2">Xin lưu ý:</h3>
          <ul className="text-sm space-y-1.5 list-disc list-inside">
            <li className="text-red-400">
              Bấm vào <span className="font-medium">MÃ ĐƠN HÀNG</span> để xem chi tiết sản phẩm <span className="font-medium">đã mua</span>
            </li>
            <li className="text-green-600">
              Tạp Hóa MMO là nơi MUA VÀ BÁN, vui lòng không gian hàng sản phẩm không nào rõ bằng người bán hàng, nếu có bất cứ thắc mắc gì về mặt hàng, xin liên hệ chỉ shop để được giải quyết hoặc bảo hành.
            </li>
            <li className="text-green-600">
              Trong trường hợp shop không giải quyết hoặc giải quyết không đúng, hãy bấm vào <span className="font-medium">"Khiếu nại đơn hàng"</span>, để bên mình có thể gỡ tiền cho người bán và hủy đơn hàng đó (Bạn chỉ có 3 ngày) trong lúc đơn hàng đó phải bạn để người bán. Bạn hoàn toàn có thể gỡ tiền đơn hàng đó nếu shop không giải quyết được.
            </li>
            <li className="text-green-600">
              Bên mình sẽ giữ tiền 2 ngày, trong trường hợp đơn hàng không có khiếu nại gì, tiền sẽ được chuyển cho người bán, tỉ lệ vận hành <span className="font-medium">KIỂM TRA KỸ SẢN PHẨM</span> sau khi mua.
            </li>
          </ul>
        </div>
      </Card>

      <Card padding="none">
        <Table>
          <TableHeader>
            <tr>
              <TableHead className="w-24">Thao tác</TableHead>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Ngày mua</TableHead>
              <TableHead className="min-w-[200px]">Gian hàng</TableHead>
              <TableHead className="min-w-[250px]">Mặt hàng</TableHead>
              <TableHead>Người bán</TableHead>
              <TableHead align="center" className="w-20">Số lượng</TableHead>
              <TableHead align="right" className="w-24">Đơn giá</TableHead>
              <TableHead align="center" className="w-24">Giảm giá</TableHead>
              <TableHead align="right" className="w-24">Tổng tiền</TableHead>
              <TableHead align="center" className="w-24">Hoàn tiền</TableHead>
              <TableHead align="center" className="w-32">Trạng thái</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <button className="text-green-500 hover:text-green-600" title="Chat">
                      <i className="fas fa-comment-dots text-xl"></i>
                    </button>
                    <button className="text-yellow-400 hover:text-yellow-500" title="Star">
                      <i className="fas fa-star text-xl"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-600" title="Cancel">
                      <i className="fas fa-times-circle text-xl"></i>
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/don-hang/${order.id}`} className="text-green-600 hover:underline font-medium">
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap">{order.date}</TableCell>
                <TableCell>
                  <Link href="#" className="text-green-600 hover:underline font-medium">
                    {order.store}
                  </Link>
                </TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>
                  <Link href={`/seller/${order.seller}`} className="text-green-600 hover:underline">
                    {order.seller}
                  </Link>
                </TableCell>
                <TableCell align="center">{order.quantity}</TableCell>
                <TableCell align="right">{order.price.toLocaleString()}</TableCell>
                <TableCell align="center">-</TableCell>
                <TableCell align="right" className="font-medium text-gray-800">
                  {order.total.toLocaleString()}
                </TableCell>
                <TableCell align="center">-</TableCell>
                <TableCell align="center">
                  <StatusBadge 
                    status={order.status} 
                    type={order.statusColor === 'bg-blue-500' ? 'info' : 'success'} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageContainer>
  )
}
