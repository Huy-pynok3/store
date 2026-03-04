const recentChats = [
  { id: 1, name: 'taphoammo', preview: 'Số gian hàng có thể tạo của bạn đ...', date: '10/8/2024', active: true, hasAlert: true },
  { id: 2, name: 'lukas_igliql', preview: 'Giá usa hơn căng bán 60k/ 1000 fl', date: '10/8/2024' },
  { id: 3, name: 'thehung6999', preview: 'Đơn hàng dịch vụ RZ9JOH1JL3 đã g...', date: '10/8/2024' },
  { id: 4, name: 'dieptrinh2509', preview: 'Đơn hàng dịch vụ MPFKUR6MMP đã g...', date: '10/8/2024' },
  { id: 5, name: 'Anhtoanab00', preview: 'Đơn hàng dịch vụ 001XQV1HNZ đã g...', date: '10/8/2024' },
  { id: 6, name: 'clayton_b1xsnb', preview: 'Đơn hàng dịch vụ 4LWQ8H71CB đã g...', date: '10/8/2024' },
  { id: 7, name: 'dragoncognab', preview: 'Đơn hàng dịch vụ T3OJKJXFEO đã g...', date: '10/8/2024' },
]

const messages = [
  { id: 1, from: 'other', text: 'Số gian hàng có thể tạo của bạn đã được tăng lên : 6. Chúc bạn kiếm được nhiều tiền!', time: '15:51 - 30/07' },
  { id: 2, from: 'me', text: 'Bạn ơi mình muốn mở thêm gian hàng', time: '06:06 - 10/08' },
  { id: 3, from: 'other', text: 'mới sẽ tương ứng với 1 gian nhé ạ', time: '07:57 - 10/08' },
  { id: 4, from: 'me', text: 'Hôm bữa mình lên ví 1 xin thêm 1 gian là 6 á giờ mình làm với rồi bạn cho mình xin thêm nhé', time: '08:26 - 10/08' },
  { id: 5, from: 'other', text: 'Số gian hàng có thể tạo của bạn đã được tăng lên : 7. Chúc bạn kiếm được nhiều tiền!', time: '08:45 - 10/08' },
]

import { PageContainer, Avatar } from '@/components/ui'

export default function ChatBoxPage() {
  return (
    <PageContainer maxWidth="sm" className="pb-8 pt-3">
        <p className="mb-2 text-[13px] text-[#be5555]">
          Bạn nên kiểm tra kỹ đơn hàng và báo cho bên mình nhé, vì sản phẩm bạn mua có thể đã từng bán cho người khác trên sàn.
        </p>

        <section className="grid border border-[#d8d8d8] bg-white lg:grid-cols-[380px_1fr]">
          <aside className="border-r border-[#d8d8d8]">
            <div className="grid grid-cols-[1fr_44px] border-b border-[#d8d8d8]">
              <div className="flex items-center gap-1 px-4 py-2.5">
                <h2 className="text-[33px] font-semibold leading-none text-[#383838]">Gần đây</h2>
                <i className="fas fa-volume-down text-[14px] text-[#5f5f5f]"></i>
              </div>
              <button className="flex items-center justify-center border-l border-[#d8d8d8] text-[18px] font-bold text-[#1f86aa] hover:bg-[#f6f6f6]">
                <span aria-hidden>&laquo;</span>
              </button>
            </div>
            <div className="max-h-[610px] overflow-y-auto">
              {recentChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`flex w-full items-start gap-3 border-b border-[#e8e8e8] px-3 py-3 text-left ${chat.active ? 'bg-[#eceff1]' : 'bg-white hover:bg-[#f8f8f8]'}`}
                >
                  <Avatar />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <p className="truncate text-[14px] font-semibold leading-none text-[#3a3a3a]">{chat.name}</p>
                        {chat.hasAlert && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#e53935]" />}
                      </div>
                      <span className="shrink-0 text-[12px] text-[#4f4f4f]">{chat.date}</span>
                    </div>
                    <p className="truncate text-[12px] text-[#8a8a8a]">{chat.preview}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <div className="flex min-h-[660px] flex-col">
            <div className="border-b border-[#d8d8d8] bg-[#f8f8f8] px-4 py-1 text-center">
              <p className="text-[13px] font-semibold text-[#1f9f3d]">@taphoammo</p>
              <p className="text-[11px] text-[#4caf50]">Online</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[#f3f3f3] px-4 py-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-2 ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.from === 'other' && <Avatar />}
                  <div className={msg.from === 'me' ? 'max-w-[68%]' : 'max-w-[72%]'}>
                    <div
                      className={`rounded-sm px-3 py-2 text-[14px] leading-5 ${
                        msg.from === 'me' ? 'bg-[#0f86aa] text-white' : 'bg-[#e8e8e8] text-[#3f3f3f]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className="mt-1 text-[11px] text-[#7a7a7a]">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#d8d8d8] bg-white px-3 py-2">
              <div className="flex items-center gap-3">
                <i className="far fa-file text-[#707070]"></i>
                <i className="far fa-smile text-[#707070]"></i>
                <input
                  type="text"
                  placeholder="Type a message"
                  className="h-8 flex-1 border border-[#bcbcbc] px-2 text-[13px] outline-none"
                />
                <button
                  type="button"
                  aria-label="Gửi tin nhắn"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f86aa] text-white hover:bg-[#0d7594]"
                >
                  <i className="fas fa-paper-plane text-[13px]"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
    </PageContainer>
  )
}
