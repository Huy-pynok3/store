'use client'

import { useState } from 'react'
import { PageContainer, Card, Button, Input } from '@/components/ui'
import SidebarCard from '@/components/layout/SidebarCard'

export default function RechargeGiftCodePage() {
  const [giftCode, setGiftCode] = useState('')

  const handleRedeem = () => {
    console.log('Redeem gift code:', giftCode)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Đã copy!')
  }

  const leftProduct = {
    warehouse: '1201',
    priceRange: '48.999 đ - 148.999 đ',
    productType: 'Sản phẩm',
    title: 'FACEBOOK VIỆT CÓ 1000-5000 BẠN BÈ 2009-2022',
    rating: 4,
    reviews: 1329,
    sold: 137273,
    complaints: '0.2%',
    seller: 'wvproxyvietc',
    category: 'Tài khoản FB',
    icon: 'facebook' as const,
    iconBgColor: '#446cb3',
    features: [
      'FB that ban be chon loc nhieu bai dang',
      'Kinh doanh: FB VN 2024-2025 tren 18 tuoi 300bb doi ten spam oke',
      'Hotmail | FB random 20 bai dang de sua, tren 18t doi dc, ten oke'
    ]
  }

  const rightProduct = {
    warehouse: '3000',
    priceRange: '2.000 đ - 15.000 đ',
    productType: 'Dịch vụ',
    title: 'WV Proxy - IP dân cư Việt Nam',
    rating: 5,
    reviews: 475,
    sold: 207787,
    complaints: '0.2%',
    seller: 'wvproxyvietc',
    category: 'Shop',
    icon: 'proxy' as const,
    features: [
      'IP dân cư Việt Nam chất lượng cao',
      'Tốc độ ổn định, không giới hạn băng thông',
      'Hỗ trợ 24/7, đổi IP miễn phí khi lỗi'
    ],
    showDownloadButton: false
  }

  return (
    <PageContainer>
      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-4 items-start">
        <aside className="hidden xl:block sticky top-[110px]">
          <SidebarCard {...leftProduct} />
        </aside>

        <main>
          <Card>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Redeem gift-code</h1>
            
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <Input
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                placeholder="Nhập mã gift code"
                fullWidth
                className="flex-1"
              />
              <Button onClick={handleRedeem} variant="success" size="lg" className="w-full sm:w-auto">
                Redeem
              </Button>
            </div>

            <div className="text-center mb-6">
              <p className="text-red-600 text-sm mb-4">
                Quét mã QR Code để nạp tiền nhanh hơn khách chính xác
              </p>
              
              <div className="inline-block bg-white border-4 border-gray-300 p-4 mb-6 max-w-full">
                <div className="w-52 h-52 sm:w-64 sm:h-64 bg-gray-100 flex items-center justify-center">
                  <i className="fas fa-qrcode text-gray-400 text-8xl"></i>
                </div>
              </div>
            </div>

            <Card className="bg-gray-50 mb-6" padding="md">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 bg-white rounded flex items-center justify-center flex-shrink-0">
                  <div className="text-green-600 font-bold text-xs text-center">
                    <div>Vietcom</div>
                    <div>bank</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm mb-1">
                    <span className="text-gray-600">STK:</span> <span className="font-medium">0711009233564</span>
                  </div>
                  <div className="text-sm mb-1">
                    <span className="text-gray-600">Người nhận:</span> <span className="font-medium">Phạm Thành Tùng</span>
                  </div>
                  <div className="text-sm flex flex-wrap items-center gap-2">
                    <span className="text-gray-600">Nội dung chuyển khoản:</span>
                    <span className="font-bold text-green-600">TS 914600</span>
                    <Button
                      onClick={() => copyToClipboard('TS 914600')}
                      variant="danger"
                      size="sm"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-bold text-red-600 mb-2">Lưu ý:</h3>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>
                  Vui lòng điền chính xác nội dung chuyển khoản để thực hiện nạp tiền tự động
                </li>
                <li>
                  Trong trường hợp nạp tiền vào tài khoản bị sai nội dung chuyển khoản, hãy liên hệ với chúng tôi để được hỗ trợ.
                </li>
                <li>
                  Tiền sẽ vào tài khoản trong vòng 1-10 phút kể từ khi giao dịch thành công.
                </li>
                <li className="text-red-600 font-medium">
                  Vietcombank trong khoảng 23-3h không hỗ trợ giao dịch, các giao dịch trong khoảng giờ này sẽ bị trì hoãn đến 3h sáng hôm sau.
                </li>
                <li>
                  Nếu quá thời gian trên mà tiền vẫn chưa vào tài khoản, hãy liên hệ với chúng tôi qua Tạp đây
                </li>
              </ul>
            </div>
          </Card>
        </main>

        <aside className="hidden xl:block sticky top-[110px]">
          <SidebarCard {...rightProduct} />
        </aside>
      </div>
    </PageContainer>
  )
}
