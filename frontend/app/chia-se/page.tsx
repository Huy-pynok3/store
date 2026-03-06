import Link from 'next/link'
import { Card, PageContainer } from '@/components/ui'

const featuredPosts = [
  {
    title: 'Người mới nên bắt đầu từ sản phẩm hay dịch vụ trên TapHoaMMO?',
    excerpt:
      'Nếu bạn mới vào hệ thống, nên hiểu rõ sự khác nhau giữa nhóm sản phẩm số và nhóm dịch vụ để chọn đúng kỳ vọng về giao hàng, kiểm tra chất lượng và hỗ trợ sau mua.',
    tag: 'Định hướng',
    href: '/faqs',
    icon: 'fa-solid fa-compass-drafting',
  },
  {
    title: '3 điều cần kiểm tra ngay sau khi mua một đơn hàng sản phẩm số',
    excerpt:
      'Mã đơn, trạng thái giữ tiền và dữ liệu nhận được là ba thứ nên đối chiếu đầu tiên. Thói quen này giúp bạn xử lý tranh chấp sớm và giảm mất dấu bằng chứng.',
    tag: 'Kinh nghiệm mua',
    href: '/don-hang',
    icon: 'fa-solid fa-bag-shopping',
  },
  {
    title: 'Vì sao gian hàng cần có bước chờ duyệt trước khi mở bán?',
    excerpt:
      'Không chỉ là kiểm duyệt nội dung, trạng thái chờ duyệt còn là lớp kiểm tra giúp shop chuẩn hóa mô tả, tồn kho và chính sách reseller trước khi nhận đơn thật.',
    tag: 'Kinh nghiệm bán',
    href: '/quan-ly-cua-hang',
    icon: 'fa-solid fa-store',
  },
]

const knowledgeColumns = [
  {
    title: 'Cho người mua',
    items: [
      'Luôn kiểm tra kỹ danh mục sản phẩm và gian hàng trước khi thanh toán.',
      'Ưu tiên lưu lại mã đơn và ảnh chụp trạng thái đơn ngay sau giao dịch.',
      'Khi gặp lỗi hàng, làm việc với shop sớm trước khi hết thời gian giữ tiền.',
      'Nạp tiền trước khi săn hàng giúp tránh lỡ kho hoặc biến động giá.',
    ],
  },
  {
    title: 'Cho người bán',
    items: [
      'Tiêu đề, mô tả và tình trạng kho càng rõ thì tỷ lệ tranh chấp càng thấp.',
      'Nếu bật reseller, cần xác định rõ phạm vi hỗ trợ sau bán và quy tắc bảo hành.',
      'Trạng thái chờ duyệt nên được xem là bước chuẩn hóa gian hàng, không phải trở ngại.',
      'Sản phẩm số cần được tổ chức kho cẩn thận để tránh lỗi giao trùng dữ liệu.',
    ],
  },
  {
    title: 'Cho người làm MMO',
    items: [
      'Dùng công cụ đúng chỗ: 2FA cho xác thực, Check Live FB cho bước sàng lọc.',
      'Không nên gom mọi nhu cầu vào một loại hàng; hãy tách rõ tài khoản, email, phần mềm và dịch vụ.',
      'Theo dõi các thay đổi trong chất lượng shop thay vì chỉ nhìn đơn giá thấp nhất.',
      'Xây thói quen bảo mật tài khoản vì số dư, lịch sử mua và dữ liệu làm việc đều nằm trong hệ thống.',
    ],
  },
]

const quickTopics = [
  { label: 'FAQs', href: '/faqs' },
  { label: 'Hỗ trợ', href: '/ho-tro' },
  { label: 'Email', href: '/san-pham/email' },
  { label: 'Dịch vụ phần mềm', href: '/dich-vu/phan-mem' },
  { label: '2FA', href: '/cong-cu/2fa' },
  { label: 'Quản lý gian hàng', href: '/quan-ly-cua-hang' },
]

export default function SharingPage() {
  return (
    <PageContainer maxWidth="lg">
      <section className="mb-6 overflow-hidden rounded-sm border border-[#dfe6e9] bg-white shadow-sm">
        <div className="grid gap-6 px-5 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-[#cfe9d8] bg-[#eefaf2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#2f9d59]">
              Chia sẻ
            </p>
            <h1 className="max-w-[720px] text-3xl font-bold leading-tight text-[#2d2d2d] md:text-4xl">
              Góc chia sẻ kinh nghiệm giao dịch, vận hành gian hàng và làm MMO thực tế
            </h1>
            <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#5e6b78] md:text-[15px]">
              Nội dung được viết theo đúng những gì đang xuất hiện trong sản phẩm hiện tại: danh mục hàng số, dịch vụ,
              đơn hàng tự động, giữ tiền, công cụ 2FA, quản lý gian hàng và cơ chế reseller.
            </p>
          </div>

          <div className="self-end rounded-sm border border-[#e3e8ee] bg-[#fafcfd] p-4 text-sm text-[#374151]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2f9d59]">Chủ đề nổi bật</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickTopics.map((topic) => (
                <Link
                  key={topic.href}
                  href={topic.href}
                  className="rounded-full border border-[#d7eadc] bg-[#f4fbf6] px-3 py-1.5 text-[#2f9d59] hover:bg-[#e9f7ed]"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        {featuredPosts.map((post) => (
          <Card key={post.title} className="rounded-sm border-[#e2e8ee] shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-[#eefaf2] text-[#2f9d59]">
              <i className={`${post.icon} text-xl`} aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2f9d59]">{post.tag}</p>
            <h2 className="mt-2 text-lg font-semibold leading-7 text-[#1f2937]">{post.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#607086]">{post.excerpt}</p>
            <Link href={post.href} className="mt-4 inline-flex text-sm font-semibold text-[#2f9d59] hover:underline">
              Xem thêm
            </Link>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-sm border-[#e2e8ee] shadow-sm">
          <h2 className="text-xl font-bold text-[#1f2937]">Kho kinh nghiệm nhanh</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {knowledgeColumns.map((column) => (
              <div key={column.title} className="rounded-sm border border-[#edf1f4] bg-[#fbfcfc] p-4">
                <h3 className="text-base font-semibold text-[#243447]">{column.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#536273]">
                  {column.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f9d59]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-sm border-[#e2e8ee] shadow-sm">
          <h2 className="text-xl font-bold text-[#1f2937]">Nên đọc tiếp từ đâu?</h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/faqs"
              className="block rounded-sm border border-[#e6ecef] bg-[#fbfcfc] px-4 py-3 hover:border-[#cfe9d8] hover:bg-white"
            >
              <p className="font-semibold text-[#243447]">FAQs - Câu hỏi thường gặp</p>
              <p className="mt-1 text-sm leading-6 text-[#536273]">
                Phù hợp khi bạn cần câu trả lời ngắn, trực diện về mua hàng, nạp tiền, bảo mật và gian hàng.
              </p>
            </Link>
            <Link
              href="/ho-tro"
              className="block rounded-sm border border-[#e6ecef] bg-[#fbfcfc] px-4 py-3 hover:border-[#cfe9d8] hover:bg-white"
            >
              <p className="font-semibold text-[#243447]">Hỗ trợ</p>
              <p className="mt-1 text-sm leading-6 text-[#536273]">
                Điểm vào phù hợp nếu bạn đang gặp sự cố thực tế và cần xác định nên xử lý trong tài khoản, đơn hàng hay gian hàng.
              </p>
            </Link>
            <Link
              href="/don-hang"
              className="block rounded-sm border border-[#e6ecef] bg-[#fbfcfc] px-4 py-3 hover:border-[#cfe9d8] hover:bg-white"
            >
              <p className="font-semibold text-[#243447]">Đơn hàng đã mua</p>
              <p className="mt-1 text-sm leading-6 text-[#536273]">
                Nơi nên kiểm tra đầu tiên sau mỗi giao dịch để xem mã đơn, trạng thái giữ tiền và thông tin gian hàng.
              </p>
            </Link>
          </div>
        </Card>
      </section>
    </PageContainer>
  )
}
