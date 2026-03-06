import Link from 'next/link'
import { Card, PageContainer } from '@/components/ui'

const supportCategories = [
  {
    title: 'Tài khoản và bảo mật',
    icon: 'fa-solid fa-shield-heart',
    summary: 'Các vấn đề liên quan đến đăng nhập, 2FA, Telegram và lịch sử truy cập.',
    actions: [
      { label: 'Thông tin tài khoản', href: '/thong-tin-tai-khoan' },
      { label: 'Công cụ 2FA', href: '/cong-cu/2fa' },
    ],
  },
  {
    title: 'Nạp tiền và thanh toán',
    icon: 'fa-solid fa-wallet',
    summary: 'Hướng dẫn nạp tiền, kiểm tra số dư và chuẩn bị thanh toán đơn hàng tự động.',
    actions: [
      { label: 'Nạp tiền', href: '/nap-tien' },
      { label: 'Đơn hàng đã mua', href: '/don-hang' },
    ],
  },
  {
    title: 'Mua hàng và khiếu nại',
    icon: 'fa-solid fa-receipt',
    summary: 'Theo dõi trạng thái đơn, thời gian giữ tiền và cách xử lý khi sản phẩm có vấn đề.',
    actions: [
      { label: 'Xem đơn hàng', href: '/don-hang' },
      { label: 'FAQs', href: '/faqs' },
    ],
  },
  {
    title: 'Gian hàng và người bán',
    icon: 'fa-solid fa-store',
    summary: 'Thiết lập gian hàng, trạng thái chờ duyệt, check trùng và quyền reseller.',
    actions: [
      { label: 'Quản lý gian hàng', href: '/quan-ly-cua-hang' },
      { label: 'Đăng ký bán hàng', href: '/dang-ky' },
    ],
  },
]

const supportSteps = [
  {
    title: 'Kiểm tra đúng khu vực',
    description:
      'Nếu lỗi xuất hiện khi mua hàng, hãy xem lại Đơn hàng đã mua. Nếu lỗi nằm ở đăng nhập, bảo mật hoặc số dư, hãy kiểm tra trong Thông tin tài khoản trước.',
  },
  {
    title: 'Giữ nguyên bằng chứng',
    description:
      'Với các vấn đề liên quan đến sản phẩm số, bạn nên giữ nguyên dữ liệu đã nhận, ảnh chụp màn hình và thời điểm phát sinh lỗi để tránh mất dấu vết.',
  },
  {
    title: 'Liên hệ đúng đầu mối',
    description:
      'Vấn đề về chất lượng sản phẩm nên làm việc với shop trước. Vấn đề về hệ thống, nạp tiền, đăng nhập hoặc lỗi công cụ thì nên đi qua trang Hỗ trợ hoặc FAQ.',
  },
]

const commonIssues = [
  {
    question: 'Đã thanh toán nhưng chưa thấy hàng ở đâu?',
    answer:
      'Trước tiên hãy vào mục Đơn hàng đã mua để kiểm tra mã đơn, trạng thái và gian hàng. Luồng hiện tại của hệ thống đang hiển thị thông tin đơn tập trung tại đó.',
  },
  {
    question: 'Đơn ở trạng thái tạm giữ tiền có phải lỗi không?',
    answer:
      'Không. Đây là cơ chế bảo vệ giao dịch của sàn để người mua có thời gian kiểm tra hàng trước khi tiền được đối soát cho người bán.',
  },
  {
    question: 'Muốn tăng an toàn cho tài khoản thì nên làm gì trước?',
    answer:
      'Nên bật 2FA, kết nối Telegram nếu cần nhận thông báo nhanh, và kiểm tra lịch sử đăng nhập trong trang Thông tin tài khoản.',
  },
  {
    question: 'Shop của tôi đang chờ duyệt thì có mở bán được không?',
    answer:
      'Không nên xem đó là trạng thái lỗi. Chờ duyệt là bước rà soát nội dung gian hàng trước khi mở bán chính thức để giảm rủi ro tranh chấp và kiểm tra cấu hình sản phẩm.',
  },
]

export default function SupportPage() {
  return (
    <PageContainer maxWidth="lg">
      <section className="mb-6 overflow-hidden rounded-sm border border-[#dfe6e9] bg-white shadow-sm">
        <div className="grid gap-6 px-5 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-[#cfe9d8] bg-[#eefaf2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#2f9d59]">
              Hỗ trợ
            </p>
            <h1 className="max-w-[720px] text-3xl font-bold leading-tight text-[#2d2d2d] md:text-4xl">
              Trung tâm hỗ trợ cho người mua, người bán và cộng tác viên trên TapHoaMMO
            </h1>
            <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#5e6b78] md:text-[15px]">
              Trang này gom lại các lối vào cần thiết nhất từ source hiện tại: đơn hàng, nạp tiền, tài khoản, công cụ 2FA,
              FAQ và quản lý gian hàng để người dùng không phải tìm rải rác trong menu.
            </p>
          </div>

          <div className="self-end rounded-sm border border-[#e3e8ee] bg-[#fafcfd] p-4 text-sm text-[#374151]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2f9d59]">Lối vào nhanh</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/don-hang" className="rounded-sm border border-[#d7eadc] bg-[#f4fbf6] px-3 py-2 text-center text-[#2f9d59] hover:bg-[#e9f7ed]">
                Đơn hàng
              </Link>
              <Link href="/nap-tien" className="rounded-sm border border-[#d7eadc] bg-[#f4fbf6] px-3 py-2 text-center text-[#2f9d59] hover:bg-[#e9f7ed]">
                Nạp tiền
              </Link>
              <Link href="/thong-tin-tai-khoan" className="rounded-sm border border-[#d7eadc] bg-[#f4fbf6] px-3 py-2 text-center text-[#2f9d59] hover:bg-[#e9f7ed]">
                Tài khoản
              </Link>
              <Link href="/faqs" className="rounded-sm border border-[#d7eadc] bg-[#f4fbf6] px-3 py-2 text-center text-[#2f9d59] hover:bg-[#e9f7ed]">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {supportCategories.map((category) => (
          <Card key={category.title} className="rounded-sm border-[#e2e8ee] shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-[#eefaf2] text-[#2f9d59]">
              <i className={`${category.icon} text-lg`} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-[#1f2937]">{category.title}</h2>
            <p className="mt-2 min-h-[72px] text-sm leading-6 text-[#607086]">{category.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="rounded-sm border border-[#d7eadc] bg-[#f4fbf6] px-3 py-1.5 text-xs font-semibold text-[#2f9d59] hover:bg-[#e9f7ed]"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-sm border-[#e2e8ee] shadow-sm">
          <h2 className="text-xl font-bold text-[#1f2937]">Quy trình xử lý khi gặp sự cố</h2>
          <div className="mt-4 space-y-4">
            {supportSteps.map((step, index) => (
              <div key={step.title} className="flex gap-4 rounded-sm border border-[#edf1f4] bg-[#fbfcfc] p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f9d59] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-[#243447]">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#536273]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-sm border-[#e2e8ee] shadow-sm">
          <h2 className="text-xl font-bold text-[#1f2937]">Vấn đề thường gặp</h2>
          <div className="mt-4 space-y-3">
            {commonIssues.map((issue) => (
              <details
                key={issue.question}
                className="group rounded-sm border border-[#e6ecef] bg-[#fbfcfc] px-4 py-3 open:border-[#cfe9d8] open:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-semibold text-[#243447]">
                  <span>{issue.question}</span>
                  <span className="mt-0.5 text-[#2f9d59] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pt-3 text-sm leading-6 text-[#536273]">{issue.answer}</p>
              </details>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
