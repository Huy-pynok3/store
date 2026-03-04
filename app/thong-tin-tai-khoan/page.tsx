'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageContainer, Card, Avatar, Button, InfoRow, Badge } from '@/components/ui'

export default function AccountInfoPage() {
  const [userData] = useState({
    username: '@minhcuong203',
    firstName: 'Chưa đặt tên',
    balance: '000 VNĐ',
    registrationDate: '12/06/2024',
    totalPurchases: '0 sản phẩm',
    totalOrders: '0 gian hàng',
    totalSold: '0 sản phẩm',
    totalPosts: '0 bài viết',
    apiKey: 'Tải',
    twoFactorEnabled: false,
    telegramConnected: false,
    loginHistory: [
      { date: '12-06-2024 19:27', ip: 'IP: 103.89.89.195', device: 'Device: Chrome 125 On Windows' }
    ]
  })

  return (
    <PageContainer maxWidth="md">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
        <section>
          <Card padding="none">
            <div className="border-b border-[#ececec] px-5 py-7">
              <div className="flex min-h-[72px] items-center gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2d9df1] text-[11px] font-bold text-white">
                  LV 4
                </div>
                <div className="w-full">
                  <div className="w-[78%]">
                    <div className="h-[10px] w-full overflow-hidden rounded-[2px] bg-[#e5e7eb]">
                      <div className="h-full w-[18%] bg-[repeating-linear-gradient(135deg,#1f86e5_0px,#1f86e5_4px,#4ca6ef_4px,#4ca6ef_8px)]" />
                    </div>
                    <p className="mt-1 text-center text-[12px] leading-none text-[#b35a5a]">
                    Hãy mua/bán thêm 787.412đ để đạt level tiếp theo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-2">
              <table className="w-full text-[14px]">
                <tbody>
                  <InfoRow label="Tài khoản" value={userData.username} />
                  <InfoRow label="Họ tên" value={userData.firstName} />
                  <InfoRow label="Số dư" value={userData.balance} />
                  <InfoRow label="Ngày đăng ký" value={userData.registrationDate} />
                  <InfoRow label="Đã mua" value={userData.totalPurchases} />
                  <InfoRow label="Số gian hàng" value={userData.totalOrders} />
                  <InfoRow label="Đã bán" value={userData.totalSold} />
                  <InfoRow 
                    label="Số bài viết" 
                    value={<Link href="#" className="text-[#2f9d59] hover:underline">{userData.totalPosts}</Link>} 
                  />
                  <InfoRow 
                    label="Mua hàng bằng API" 
                    value={
                      <button className="inline-flex items-center gap-1 text-[#c94444] hover:underline">
                        <span aria-hidden>✖</span>
                        {userData.apiKey}
                      </button>
                    } 
                  />
                  <InfoRow 
                    label="Bảo mật 2 lớp" 
                    value={
                      <div className="flex flex-col gap-1">
                        <button className="inline-flex w-fit items-center gap-1 text-[#c94444] hover:underline">
                          <span aria-hidden>✖</span>
                          {userData.twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}
                        </button>
                        <p className="text-[12px] text-[#2d9f5d]">
                          (Hãy bảo vệ tài khoản của bạn bằng bảo mật 2FA)
                        </p>
                      </div>
                    } 
                  />
                  <InfoRow 
                    label="Kết nối Telegram" 
                    value={
                      <div className="flex flex-col gap-1">
                        <button className="inline-flex w-fit items-center gap-1 text-[#c94444] hover:underline">
                          <span aria-hidden>✖</span>
                          {userData.telegramConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                        </button>
                        <p className="text-[12px] text-[#2d9f5d]">
                          (Bạn có thể gỡ và nhận được tin nhắn mới qua Telegram nếu có kết nối)
                        </p>
                      </div>
                    } 
                    className="border-b-0"
                  />
                </tbody>
              </table>

              <div className="py-5 text-center">
                <Button>Chỉnh sửa</Button>
              </div>
            </div>
          </Card>
        </section>

        <aside>
          <Card>
            <div className="mx-auto mb-4 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#e8edf2]">
              <Avatar size="xl" />
            </div>
            <h2 className="text-center text-[34px] font-semibold leading-none tracking-tight text-[#4c4c4c]">
              {userData.username}
            </h2>
            <p className="mt-2 text-center text-[12px] text-[#3ea64d]">Online</p>
          </Card>

          <Card padding="none" className="border-t-0">
            <h3 className="border-b border-[#efefef] py-2 text-center text-[15px] text-[#505050]">Lịch sử đăng nhập</h3>
            <div className="h-[220px] overflow-y-auto p-4">
              <div className="mb-2 text-center text-[#808080]">...</div>
              {userData.loginHistory.map((login, index) => (
                <div key={index} className="text-[12px]">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Badge variant="warning" size="xs">{login.date}</Badge>
                    <Badge variant="success" size="xs">{login.ip}</Badge>
                  </div>
                  <p className="text-[#2f2f2f]">{login.device}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="none" className="border-t-0">
            <div className="h-[190px]" />
          </Card>
        </aside>
      </div>
    </PageContainer>
  )
}
