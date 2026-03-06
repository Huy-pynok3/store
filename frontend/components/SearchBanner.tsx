'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from './ui'

const DROPDOWN_OPTIONS = {
  username: {
    label: 'Tên người bán',
    subtypes: [],
    showDuplicate: true
  },
  email: {
    label: 'Email',
    subtypes: [
      { value: '', label: 'Tất cả' },
      { value: 'gmail', label: 'Gmail' },
      { value: 'hotmail', label: 'HotMail' },
      { value: 'outlook', label: 'Outlook' },
      { value: 'mailru', label: 'MailRu' },
      { value: 'maildomain', label: 'MailDomain' },
      { value: 'yahoo', label: 'YahooMail' },
      { value: 'proton', label: 'ProtonMail' },
      { value: 'other', label: 'Loại Mail Khác' }
    ],
    showDuplicate: true
  },
  software: {
    label: 'Phần mềm',
    subtypes: [
      { value: '', label: 'Tất cả' },
      { value: 'fb', label: 'Phần Mềm FB' },
      { value: 'google', label: 'Phần Mềm Google' },
      { value: 'youtube', label: 'Phần Mềm Youtube' },
      { value: 'crypto', label: 'Phần Mềm Tiền Ảo' },
      { value: 'ptc', label: 'Phần Mềm PTC' },
      { value: 'captcha', label: 'Phần Mềm Capcha' },
      { value: 'offer', label: 'Phần Mềm Offer' },
      { value: 'ptu', label: 'Phần Mềm PTU' },
      { value: 'other', label: 'Phần Mềm Khác' }
    ],
    showDuplicate: true
  },
  account: {
    label: 'Tài khoản',
    subtypes: [
      { value: '', label: 'Tất cả' },
      { value: 'fb', label: 'Tài khoản FB' },
      { value: 'bm', label: 'Tài Khoản BM' },
      { value: 'zalo', label: 'Tài Khoản Zalo' },
      { value: 'twitter', label: 'Tài Khoản Twitter' },
      { value: 'telegram', label: 'Tài Khoản Telegram' },
      { value: 'instagram', label: 'Tài Khoản Instagram' },
      { value: 'shopee', label: 'Tài Khoản Shopee' },
      { value: 'discord', label: 'Tài Khoản Discord' },
      { value: 'tiktok', label: 'Tài khoản TikTok' },
      { value: 'antivirus', label: 'Key Diệt Virus' },
      { value: 'windows', label: 'Key Window' },
      { value: 'other', label: 'Tài Khoản Khác' }
    ],
    showDuplicate: true
  },
  'other-product': {
    label: 'Khác',
    subtypes: [
      { value: '', label: 'Tất cả' },
      { value: 'card', label: 'Thẻ Nạp' },
      { value: 'vps', label: 'VPS' },
      { value: 'other', label: 'Khác' }
    ],
    showDuplicate: true
  },
  interaction: {
    label: 'Tăng tương tác',
    subtypes: [
      { value: '', label: 'Tất cả' },
      { value: 'facebook', label: 'Dịch vụ Facebook' },
      { value: 'tiktok', label: 'Dịch vụ Tiktok' },
      { value: 'google', label: 'Dịch vụ Google' },
      { value: 'telegram', label: 'Dịch vụ Telegram' },
      { value: 'shopee', label: 'Dịch vụ Shopee' },
      { value: 'discord', label: 'Dịch vụ Discord' },
      { value: 'twitter', label: 'Dịch vụ Twitter' },
      { value: 'youtube', label: 'Dịch vụ Youtube' },
      { value: 'zalo', label: 'Dịch vụ Zalo' },
      { value: 'instagram', label: 'Dịch vụ Instagram' },
      { value: 'other', label: 'Tương tác khác' }
    ],
    showDuplicate: true
  },
  'software-service': {
    label: 'Dịch vụ phần mềm',
    subtypes: [
      { value: '', label: 'Tất cả' },
      { value: 'code', label: 'Dịch vụ code tool' },
      { value: 'design', label: 'Dịch vụ đồ họa' },
      { value: 'video', label: 'Dịch vụ video' },
      { value: 'other', label: 'Dịch vụ tool khác' }
    ],
    showDuplicate: true
  },
  blockchain: {
    label: 'Blockchain',
    subtypes: [
      { value: '', label: 'Tất cả' },
      { value: 'crypto', label: 'Dịch vụ tiền ảo' },
      { value: 'nft', label: 'Dịch vụ NFT' },
      { value: 'coinlist', label: 'Dịch vụ Coinlist' },
      { value: 'other', label: 'Blockchain khác' }
    ],
    showDuplicate: true
  },
  'other-service': {
    label: 'Dịch vụ khác',
    subtypes: [
      { value: '', label: 'Tất cả' },
      { value: 'other', label: 'Dịch vụ khác' }
    ],
    showDuplicate: true
  }
}

export default function SearchBanner() {
  const [firstFilter, setFirstFilter] = useState('')
  const [secondFilter, setSecondFilter] = useState('')
  const [thirdFilter, setThirdFilter] = useState('')

  const currentOption = DROPDOWN_OPTIONS[firstFilter as keyof typeof DROPDOWN_OPTIONS]
  const showSecondDropdown = firstFilter && firstFilter !== 'username'
  const showThirdDropdown = firstFilter && currentOption?.showDuplicate

  return (
    <section className="relative mb-4">
      <div className="relative h-[240px] sm:h-[280px] rounded-sm overflow-hidden">
        <Image
          src="/images/home-banner.jpg"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/45"></div>
        
        <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[860px] max-w-[80%] sm:max-w-[95%] z-10 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            {/* Dropdown 1 - Tùy chọn tìm kiếm */}
            <select 
              value={firstFilter}
              onChange={(e) => {
                setFirstFilter(e.target.value)
                setSecondFilter('')
                setThirdFilter('')
              }}
              className="w-full sm:w-auto sm:flex-1 px-3 border border-[#d8d8d8] rounded-sm text-[13px] h-[34px] bg-white text-black font-[Arial,Helvetica,sans-serif]"
            >
              <option value="">Tùy chọn tìm kiếm</option>
              <option value="username">Tên người bán</option>
              <option value="email">Email</option>
              <option value="software">Phần mềm</option>
              <option value="account">Tài khoản</option>
              <option value="other-product">Khác</option>
              <option value="interaction">Tăng tương tác</option>
              <option value="software-service">Dịch vụ phần mềm</option>
              <option value="blockchain">Blockchain</option>
              <option value="other-service">Dịch vụ khác</option>
            </select>

            {/* Dropdown 2 - Subtype */}
            <select 
              value={secondFilter}
              onChange={(e) => setSecondFilter(e.target.value)}
              disabled={!showSecondDropdown}
              className="w-full sm:w-auto sm:flex-[0_0_30%] px-3 border border-[#d8d8d8] rounded-sm text-[13px] h-[34px] text-[#666] bg-white/70 font-[Arial,Helvetica,sans-serif] disabled:opacity-50"
            >
              {showSecondDropdown && currentOption?.subtypes ? (
                currentOption.subtypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              ) : (
                <option value=""></option>
              )}
            </select>

            {/* Dropdown 3 - Duplicate Filter */}
            <select 
              value={thirdFilter}
              onChange={(e) => setThirdFilter(e.target.value)}
              disabled={!showThirdDropdown}
              className="w-full sm:w-auto sm:flex-[0_0_30%] px-3 border border-[#d8d8d8] rounded-sm text-[13px] h-[34px] text-[#666] bg-white/70 font-[Arial,Helvetica,sans-serif] disabled:opacity-50"
            >
              <option value="">Tất cả</option>
              <option value="NOTDUPLICATE">Loại không trùng</option>
              <option value="DUPLICATED">Có thể trùng</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Tìm gian hàng hoặc người bán"
            className="w-full px-3 border border-[#d8d8d8] rounded-sm text-[13px] h-[36px] mb-2 bg-white text-[#444] placeholder:text-[#8e97a3] font-[Arial,Helvetica,sans-serif]"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          />
          <Button 
            variant="success" 
            className="w-full sm:w-[130px] mx-auto block text-[14px] h-[36px] font-semibold font-[Arial,Helvetica,sans-serif]"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </section>
  )
}
