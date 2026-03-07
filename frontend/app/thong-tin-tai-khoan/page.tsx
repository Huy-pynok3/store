'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageContainer, Card, Avatar, Button, InfoRow, Badge } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

function formatBalance(balance: number | string | undefined): string {
  if (balance === undefined || balance === null) return '0 VNĐ'
  const num = typeof balance === 'string' ? parseFloat(balance) : balance
  if (isNaN(num)) return '0 VNĐ'
  return num.toLocaleString('vi-VN') + ' VNĐ'
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function AccountInfoPage() {
  const { user, loading, isLoggedIn } = useAuth()
  const router = useRouter()

  // Mock data cho các field chưa có API
  const mockData = {
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
  }

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/')
    }
  }, [loading, isLoggedIn, router])

  if (loading) {
    return (
      <PageContainer maxWidth="md">
        <div className="flex items-center justify-center py-20 text-[#808080]">Đang tải...</div>
      </PageContainer>
    )
  }

  if (!user) return null

  const displayUsername = user.username ? `@${user.username}` : '—'
  const displayName = (user as any).fullName || 'Chưa đặt tên'
  const displayBalance = formatBalance((user as any).balance)
  const displayDate = formatDate((user as any).createdAt)

  return (
    <PageContainer maxWidth="md">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
        <section>
          <Card padding="none">
            <div className="border-b border-[#ececec] px-5 py-7">
              <div className="flex min-h-[76px] items-center pl-6 md:pl-10">
                <div className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2d9df1] text-[12px] font-bold text-white">
                  LV 4
                </div>
                <div className="ml-12 flex w-full justify-start pl-2">
                  <div className="relative w-[86%]">
                    <div className="h-[13px] w-full overflow-hidden rounded-[2px] bg-[#e5e7eb]">
                      <div className="h-full w-[18%] bg-[repeating-linear-gradient(135deg,#1f86e5_0px,#1f86e5_4px,#4ca6ef_4px,#4ca6ef_8px)]" />
                    </div>
                    <p className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-center text-[12px] leading-none text-[#b35a5a]">
                    Hãy mua/bán thêm 787.412đ để đạt level tiếp theo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-2">
              <table className="w-full table-fixed text-[14px] [&_td:first-child]:w-[150px] [&_td:first-child]:pr-0 [&_td:first-child]:text-center [&_td:last-child]:pl-0 [&_td:last-child]:text-center">
                <tbody>
                  <InfoRow label="Tài khoản" value={displayUsername} />
                  <InfoRow label="Họ tên" value={displayName} />
                  <InfoRow label="Số dư" value={displayBalance} />
                  <InfoRow label="Ngày đăng ký" value={displayDate} />
                  <InfoRow label="Đã mua" value={mockData.totalPurchases} />
                  <InfoRow label="Số gian hàng" value={mockData.totalOrders} />
                  <InfoRow label="Đã bán" value={mockData.totalSold} />
                  <InfoRow
                    label="Số bài viết"
                    value={<Link href="#" className="text-[#2f9d59] hover:underline">{mockData.totalPosts}</Link>}
                  />
                  <InfoRow
                    label="Mua hàng bằng API"
                    value={
                      <button className="inline-flex items-center gap-1 text-[#c94444] hover:underline">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#d63b3b] text-white" aria-hidden="true">
                          <i className="fa-solid fa-xmark not-italic text-[9px] leading-none" aria-hidden="true" />
                        </span>
                        {mockData.apiKey}
                      </button>
                    }
                  />
                  <InfoRow
                    label="Bảo mật 2 lớp"
                    value={
                      <div className="flex flex-col items-center gap-1 text-center">
                        <button className="inline-flex w-fit items-center gap-1 text-[#c94444] hover:underline">
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#d63b3b] text-white" aria-hidden="true">
                            <i className="fa-solid fa-xmark not-italic text-[9px] leading-none" aria-hidden="true" />
                          </span>
                          {mockData.twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}
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
                      <div className="flex flex-col items-center gap-1 text-center">
                        <button className="inline-flex w-fit items-center gap-1 text-[#c94444] hover:underline">
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#d63b3b] text-white" aria-hidden="true">
                            <i className="fa-solid fa-xmark not-italic text-[9px] leading-none" aria-hidden="true" />
                          </span>
                          {mockData.telegramConnected ? 'Đã kết nối' : 'Chưa kết nối'}
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
              {displayUsername}
            </h2>
            <p className="mt-2 text-center text-[12px] text-[#3ea64d]">Online</p>
          </Card>

          <Card padding="none" className="border-t-0">
            <h3 className="border-b border-[#efefef] py-2 text-center text-[15px] text-[#505050]">Lịch sử đăng nhập</h3>
            <div className="h-[220px] overflow-y-auto p-4">
              <div className="mb-2 text-center text-[#808080]">...</div>
              {mockData.loginHistory.map((login, index) => (
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

