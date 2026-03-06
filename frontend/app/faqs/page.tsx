import Link from 'next/link'
import { Card, PageContainer } from '@/components/ui'

const faqGroups = [
  {
    title: 'Mua hàng và giao dịch',
    description: 'Các câu hỏi dành cho người mua khi tìm sản phẩm, thanh toán và kiểm tra đơn hàng.',
    items: [
      {
        question: 'TapHoaMMO đang bán những gì?',
        answer:
          'Nền tảng hiện chia rõ thành 2 nhóm lớn là sản phẩm và dịch vụ. Ở phần sản phẩm có Email, Phần mềm, Tài khoản và các mặt hàng số khác. Ở phần dịch vụ có Tăng tương tác, Dịch vụ phần mềm, Blockchain và các dịch vụ số liên quan đến MMO.',
      },
      {
        question: 'Sau khi thanh toán tôi nhận hàng theo cách nào?',
        answer:
          'Luồng hiện tại của site đang đi theo hướng giao hàng tự động. Sau khi thanh toán thành công, đơn hàng được tạo ngay trong mục Đơn hàng đã mua để bạn xem mã đơn, gian hàng, trạng thái và theo dõi việc xử lý hoặc khiếu nại nếu cần.',
      },
      {
        question: 'Vì sao đơn hàng lại ở trạng thái tạm giữ tiền?',
        answer:
          'Phần giới thiệu và trang đơn hàng đều cho thấy hệ thống có cơ chế giữ tiền trong một khoảng thời gian để người mua kiểm tra chất lượng hàng và để người bán có trách nhiệm hỗ trợ sau bán. Đây là lớp an toàn quan trọng của sàn, thay cho mua bán tay đôi thiếu kiểm soát.',
      },
      {
        question: 'Nếu sản phẩm lỗi hoặc shop xử lý chậm thì làm gì?',
        answer:
          'Bạn nên vào chi tiết đơn hàng càng sớm càng tốt, giữ nguyên bằng chứng và dùng luồng khiếu nại của hệ thống trong thời gian đơn còn hiệu lực. Nội dung hiện có trong trang Đơn hàng đã mua cũng nhấn mạnh rằng người mua cần thao tác sớm để hệ thống có thể tạm dừng đối soát cho người bán.',
      },
    ],
  },
  {
    title: 'Nạp tiền và tài khoản',
    description: 'Các nội dung phù hợp với luồng đăng nhập, nạp tiền và bảo mật đang có trong giao diện.',
    items: [
      {
        question: 'Muốn mua hàng tôi có cần nạp tiền trước không?',
        answer:
          'Có. Header đã tách riêng mục Nạp tiền cho tài khoản đã đăng nhập, cho thấy số dư là một phần cốt lõi của trải nghiệm mua hàng. Bạn nên nạp trước để khi gặp sản phẩm phù hợp có thể thanh toán ngay, tránh hết kho hoặc thay đổi giá.',
      },
      {
        question: 'Tôi nên bật 2FA và kết nối Telegram không?',
        answer:
          'Nên bật. Trang thông tin tài khoản hiện đã dành sẵn chỗ cho Bảo mật 2 lớp và Kết nối Telegram, điều đó cho thấy đây là hai lớp bảo vệ và nhận thông báo quan trọng cho người dùng thường xuyên giao dịch hoặc quản lý gian hàng.',
      },
      {
        question: 'Số dư và lịch sử hoạt động xem ở đâu?',
        answer:
          'Bạn có thể xem nhanh số dư ngay trên header sau khi đăng nhập, còn chi tiết hơn thì vào trang Thông tin tài khoản để kiểm tra cấp độ, số dư, ngày đăng ký, lịch sử đăng nhập và các trạng thái bảo mật.',
      },
    ],
  },
  {
    title: 'Gian hàng và người bán',
    description: 'Nhóm này bám theo phần quản lý cửa hàng, check trùng sản phẩm và quyền reseller trong source.',
    items: [
      {
        question: 'Muốn bắt đầu bán hàng trên TapHoaMMO thì vào đâu?',
        answer:
          'Bạn có thể đi từ mục Đăng ký bán hàng ở thanh trên cùng hoặc vào khu vực Quản lý cửa hàng sau khi có quyền bán. Luồng seller trong source đã có trang quản lý riêng để xem danh sách gian hàng, chỉnh sửa sản phẩm và theo dõi trạng thái như chờ duyệt hoặc đang bán.',
      },
      {
        question: 'Vì sao có trạng thái chờ duyệt?',
        answer:
          'Trạng thái chờ duyệt hợp lý với luồng vận hành của sàn vì giúp hệ thống rà soát nội dung gian hàng trước khi mở bán. Điều này đặc biệt quan trọng với sản phẩm số, nơi tiêu đề, mô tả, kho hàng và quyền reseller cần được kiểm tra để giảm rủi ro tranh chấp.',
      },
      {
        question: 'Check trùng sản phẩm nghĩa là gì?',
        answer:
          'Phần giới thiệu của trang nhấn mạnh việc kiểm tra trùng là một tính năng cốt lõi. Mục tiêu là hạn chế tình trạng một dữ liệu bị bán lặp cho nhiều người, nhất là với tài khoản, email hoặc tài nguyên số mang tính duy nhất.',
      },
      {
        question: 'Reseller dùng để làm gì?',
        answer:
          'Trong khu vực quản lý gian hàng đã có cột Reseller và các tuỳ chọn liên quan, nên có thể hiểu đây là cơ chế cho phép cộng tác viên bán lại hàng từ shop gốc theo chính sách mà người bán thiết lập. FAQ này là nơi phù hợp để giải thích rõ quyền bán lại, chiết khấu và trách nhiệm hỗ trợ sau bán.',
      },
    ],
  },
  {
    title: 'Công cụ và hỗ trợ',
    description: 'Các câu hỏi liên quan tới tiện ích có sẵn trong menu điều hướng.',
    items: [
      {
        question: 'Các công cụ 2FA và Check Live FB dùng khi nào?',
        answer:
          'Hai công cụ này đang được đưa thẳng lên menu chính, nên chúng không phải tính năng phụ. 2FA hỗ trợ xử lý các luồng mã xác thực, còn Check Live FB phù hợp khi bạn cần sàng lọc nhanh trạng thái tài khoản trước hoặc sau khi làm việc với dữ liệu Facebook.',
      },
      {
        question: 'Khi nào nên liên hệ hỗ trợ thay vì nhắn trực tiếp cho shop?',
        answer:
          'Nếu câu hỏi liên quan đến cách dùng website, nạp tiền, lỗi tài khoản, đăng nhập hoặc sự cố hệ thống thì nên đi qua mục Hỗ trợ. Nếu vấn đề nằm ở chất lượng sản phẩm cụ thể, bạn nên làm việc với shop trước, sau đó mới dùng kênh khiếu nại nếu hai bên không xử lý được.',
      },
      {
        question: 'TapHoaMMO phù hợp với ai?',
        answer:
          'Phù hợp với người mua sản phẩm số cần giao dịch nhanh, người làm MMO cần kho tài nguyên ổn định, và cả người bán muốn có một nơi quản lý gian hàng, tồn kho, đơn giá, chiết khấu sàn và trạng thái sản phẩm một cách tập trung.',
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <PageContainer maxWidth="lg">
      <section className="mb-6 overflow-hidden rounded-sm border border-[#dfe6e9] bg-white shadow-sm">
        <div className="grid gap-6 px-5 py-8 md:grid-cols-[1.3fr_0.9fr] md:px-8">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-[#cfe9d8] bg-[#eefaf2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#2f9d59]">
              FAQs
            </p>
            <h1 className="max-w-[720px] text-3xl font-bold leading-tight text-[#2d2d2d] md:text-4xl">
              Câu hỏi thường gặp dành cho người mua, người bán và cộng tác viên trên TapHoaMMO
            </h1>
            <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#5e6b78] md:text-[15px]">
              Nội dung dưới đây được viết lại từ các luồng đã có trong source hiện tại: sản phẩm số, dịch vụ MMO, nạp tiền,
              đơn hàng, quản lý gian hàng, reseller, 2FA và Telegram.
            </p>
          </div>

          <div className="self-end rounded-sm border border-[#e3e8ee] bg-[#fafcfd] p-4 text-sm text-[#374151]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2f9d59]">Lối vào nhanh</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/san-pham/email" className="rounded-full border border-[#d7eadc] bg-[#f4fbf6] px-3 py-1.5 text-[#2f9d59] hover:bg-[#e9f7ed]">
                Sản phẩm
              </Link>
              <Link href="/dich-vu/phan-mem" className="rounded-full border border-[#d7eadc] bg-[#f4fbf6] px-3 py-1.5 text-[#2f9d59] hover:bg-[#e9f7ed]">
                Dịch vụ
              </Link>
              <Link href="/don-hang" className="rounded-full border border-[#d7eadc] bg-[#f4fbf6] px-3 py-1.5 text-[#2f9d59] hover:bg-[#e9f7ed]">
                Đơn hàng
              </Link>
              <Link href="/thong-tin-tai-khoan" className="rounded-full border border-[#d7eadc] bg-[#f4fbf6] px-3 py-1.5 text-[#2f9d59] hover:bg-[#e9f7ed]">
                Tài khoản
              </Link>
              <Link href="/quan-ly-cua-hang" className="rounded-full border border-[#d7eadc] bg-[#f4fbf6] px-3 py-1.5 text-[#2f9d59] hover:bg-[#e9f7ed]">
                Gian hàng
              </Link>
              <Link href="/cong-cu/2fa" className="rounded-full border border-[#d7eadc] bg-[#f4fbf6] px-3 py-1.5 text-[#2f9d59] hover:bg-[#e9f7ed]">
                Công cụ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5">
        {faqGroups.map((group) => (
          <Card key={group.title} className="rounded-sm border-[#e2e8ee] shadow-sm">
            <div className="border-b border-[#eef2f4] pb-4">
              <h2 className="text-xl font-bold text-[#1f2937]">{group.title}</h2>
              <p className="mt-1 text-sm leading-6 text-[#607086]">{group.description}</p>
            </div>

            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-sm border border-[#e6ecef] bg-[#fbfcfc] px-4 py-3 open:border-[#cfe9d8] open:bg-[#ffffff]"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-semibold text-[#243447]">
                    <span>{item.question}</span>
                    <span className="mt-0.5 text-[#2f9d59] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pt-3 text-sm leading-6 text-[#536273]">{item.answer}</p>
                </details>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
