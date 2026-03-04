'use client'

import { useMemo, useState } from 'react'
import { Avatar, PageContainer } from '@/components/ui'

type Message = {
  id: number
  from: 'me' | 'other'
  text: string
  time: string
}

type Chat = {
  id: number
  name: string
  preview: string
  date: string
  hasAlert?: boolean
  messages: Message[]
}

const recentChats: Chat[] = [
  {
    id: 1,
    name: 'taphoammo',
    preview: 'Xin hãy cảnh giác với giao dịch không được bảo hiểm bên ngoài sàn.',
    date: '23/05',
    hasAlert: true,
    messages: [
      { id: 1, from: 'other', text: 'shop báo đơn này hoàn 340k bạn đồng ý không ạ', time: '07:05 - 22/05' },
      { id: 2, from: 'me', text: 'Mình đồng ý', time: '07:07 - 22/05' },
      { id: 3, from: 'me', text: 'Nhờ admin xử lý giúp', time: '12:15 - 22/05' },
      { id: 4, from: 'me', text: 'M vẫn chưa nhận đc tiền hoàn', time: '12:23 - 23/05' },
      { id: 5, from: 'other', text: 'bên mình đang tạo code cho shop ạ', time: '12:56 - 23/05' },
    ],
  },
  {
    id: 2,
    name: 'lukas_igliql',
    preview: 'Giá usa hơn căng bán 60k / 1000 fl',
    date: '10/08',
    messages: [{ id: 1, from: 'other', text: 'Giá usa hơn căng bán 60k / 1000 fl', time: '16:20 - 10/08' }],
  },
  {
    id: 3,
    name: 'thehung6999',
    preview: 'Đơn hàng dịch vụ RZ9JOH1JL3 đã giao thành công.',
    date: '10/08',
    messages: [{ id: 1, from: 'other', text: 'Đơn hàng dịch vụ RZ9JOH1JL3 đã giao thành công.', time: '08:45 - 10/08' }],
  },
]

export default function ChatBoxPage() {
  const [selectedChatId, setSelectedChatId] = useState<number>(recentChats[0].id)
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')

  const selectedChat = useMemo(() => {
    return recentChats.find((chat) => chat.id === selectedChatId) ?? recentChats[0]
  }, [selectedChatId])

  return (
    <PageContainer maxWidth="sm" className="pb-3 pt-2 sm:pb-8 sm:pt-3">
      <section className="overflow-hidden border border-[#d8d8d8] bg-white lg:grid lg:grid-cols-[350px_1fr]">
        <aside className={`border-r border-[#d8d8d8] ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
          <div className="grid grid-cols-[1fr_44px] border-b border-[#d8d8d8]">
            <div className="flex items-center gap-1 px-4 py-2.5">
              <h2 className="text-[30px] font-semibold leading-none text-[#383838]">Gần đây</h2>
              <i className="fas fa-volume-down text-[14px] text-[#5f5f5f]"></i>
            </div>
            <button type="button" className="flex items-center justify-center border-l border-[#d8d8d8] text-[18px] font-bold text-[#1f86aa] hover:bg-[#f6f6f6]">
              <span aria-hidden>&laquo;</span>
            </button>
          </div>

          <div className="max-h-[610px] overflow-y-auto">
            {recentChats.map((chat) => {
              const isActive = chat.id === selectedChatId
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => {
                    setSelectedChatId(chat.id)
                    setMobileView('detail')
                  }}
                  className={`flex w-full items-start gap-3 border-b border-[#e8e8e8] px-3 py-3 text-left ${isActive ? 'bg-[#eceff1]' : 'bg-white hover:bg-[#f8f8f8]'}`}
                >
                  <Avatar />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <p className="truncate text-[14px] font-semibold leading-none text-[#3a3a3a]">{chat.name}</p>
                        {chat.hasAlert && <i className="fas fa-check-circle text-[12px] text-[#e73f36]"/>}
                      </div>
                      <span className="shrink-0 text-[12px] text-[#4f4f4f]">{chat.date}</span>
                    </div>
                    <p className="truncate text-[12px] text-[#8a8a8a]">{chat.preview}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        <div className={`${mobileView === 'list' ? 'hidden lg:flex' : 'flex'} min-h-[650px] flex-col`}>
          <div className="border-b border-[#d8d8d8] bg-[#f7f7f7] px-3 py-2">
            <div className="relative flex items-center justify-center">
              <div className="flex items-center justify-center gap-1 text-[18px] font-semibold leading-none text-[#177c38]">
                <span>@{selectedChat.name}</span>
                <i className="fas fa-check-circle text-[14px] text-[#e73f36]"></i>
                <span className="text-[18px] text-[#48a84f]">Online</span>
              </div>
            </div>
            <div className="mt-1 flex items-center gap-1 lg:block">
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-[28px] leading-none text-[#1f86aa] lg:hidden"
                aria-label="Quay lại danh sách hội thoại"
              >
                &laquo;
              </button>
              <p className="block min-w-0 flex-1 overflow-hidden whitespace-nowrap text-ellipsis bg-[#f8cf42] px-2 py-0.5 text-left text-[10px] font-semibold text-[#2e2e2e] lg:mx-auto lg:w-fit lg:text-center">
                Xin hãy cảnh giác với giao dịch không được bảo hiểm bên ngoài sàn!
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-white px-3 py-4 sm:px-4">
            {selectedChat.messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2 ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'other' && <Avatar />}
                <div className={msg.from === 'me' ? 'max-w-[82%] sm:max-w-[68%]' : 'max-w-[82%] sm:max-w-[72%]'}>
                  <div className={`rounded-[4px] px-3 py-2 text-[16px] leading-[1.3] ${msg.from === 'me' ? 'bg-[#0b7f9f] text-white' : 'bg-[#efefef] text-[#3f3f3f]'}`}>
                    {msg.text}
                  </div>
                  <p className="mt-1 text-[11px] text-[#7a7a7a]">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#d8d8d8] bg-white px-3 py-2">
            <div className="flex items-center gap-3">
              <button type="button" className="text-[#707070]" aria-label="Đính kèm tệp">
                <i className="far fa-file text-[18px]"></i>
              </button>
              <button type="button" className="text-[#707070]" aria-label="Biểu cảm">
                <i className="far fa-smile text-[18px]"></i>
              </button>
              <button type="button" className="text-[#707070]" aria-label="Tùy chọn hội thoại">
                <i className="fas fa-list text-[15px]"></i>
              </button>
              <input
                type="text"
                placeholder="Type a message"
                className="h-9 flex-1 text-[16px] outline-none placeholder:text-[#949494] sm:text-[13px]"
              />
              <button
                type="button"
                aria-label="Gửi tin nhắn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f86aa] text-white hover:bg-[#0d7594]"
              >
                <i className="fas fa-paper-plane text-[15px]"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
