'use client'

import { useState } from 'react'
import { Card, Button } from './ui'

export default function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <Card className="rounded border-green-500">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          TaphoaMMO - Sàn thương mại điện tử sản phẩm số
        </h2>
        
        <div className={`text-sm text-gray-700 leading-relaxed space-y-3 ${!isExpanded ? 'line-clamp-2' : ''}`}>
          <p>Một sản phẩm ra đời với mục đích thuận tiện và an toàn hơn trong các giao dịch mua bán sản phẩm số.</p>
          
          <p>
            Như các bạn đã biết, tình trạng lừa đảo trên mạng xã hội kéo dài bao nhiêu năm nay, mặc dù đã có rất nhiều giải pháp từ cộng đồng như là trung gian hay bảo hiểm, nhưng vẫn rất nhiều người dùng lựa chọn mua bán nhanh gọn mà bỏ qua các bước kiểm tra, hay trung gian, từ đó tạo cơ hội cho s.c.a.m.m.e.r hoạt động. Ở TaphoaMMO, bạn sẽ có 1 trải nghiệm mua hàng yên tâm hơn rất nhiều, chúng tôi sẽ giữ tiền người bán 3 ngày, kiểm tra toàn bộ sản phẩm bán ra có trùng với người khác hay không, nhằm mục đích tạo ra một nơi giao dịch mà người dùng có thể tin tưởng, một trang mà người bán có thể yên tâm đặt kho hàng, và cạnh tranh sòng phẳng.
          </p>
          
          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Các tính năng trên trang:</h3>
          <ul className="list-none space-y-2 ml-0">
            <li className="relative pl-5">
              <span className="absolute left-0 text-primary">•</span>
              <strong>Check trùng sản phẩm bán ra:</strong> toàn bộ gian hàng cam kết không bán trùng, hệ thống của chúng tôi sẽ kiểm tra từng sản phẩm một, để đảm bảo hàng đến tay người dùng chưa từng được bán cho ai khác trên trang, và hàng bạn đã mua, cũng không thể bán cho ai khác nữa.
            </li>
            <li className="relative pl-5">
              <span className="absolute left-0 text-primary">•</span>
              <strong>Nạp tiền và thanh toán tự động:</strong> Bạn chỉ cần nạp tiền đúng cú pháp, số dư của bạn sẽ được cập nhật sau 1-5 phút. Mọi bước thanh toán và giao hàng đều được thực hiện ngay tức thì.
            </li>
            <li className="relative pl-5">
              <span className="absolute left-0 text-primary">•</span>
              <strong>Giữ tiền đơn hàng 3 ngày:</strong> Sau khi bạn mua hàng, đơn hàng đó sẽ ở trạng thái Tạm giữ tiền 3 ngày, đủ thời gian để bạn kiểm tra, đổi pass sản phẩm. Nếu có vấn đề gì, hãy nhanh chóng dùng tính năng "Khiếu nại" nhé.
            </li>
            <li className="relative pl-5">
              <span className="absolute left-0 text-primary">•</span>
              <strong>Tính năng dành cho cộng tác viên (Reseller):</strong> Các bạn đọc thêm ở mục "FAQs - Câu hỏi thường gặp" nhé
            </li>
          </ul>
          
          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Các mặt hàng đang kinh doanh tại TaphoaMMO:</h3>
          <ul className="list-none space-y-2 ml-0">
            <li className="relative pl-5">
              <span className="absolute left-0 text-primary">•</span>
              <strong>Mua bán email:</strong> Mua bán gmail, mail outlook, domain... tất cả đều có thể được tự do mua bán trên trang.
            </li>
            <li className="relative pl-5">
              <span className="absolute left-0 text-primary">•</span>
              <strong>Mua bán phần mềm MMO:</strong> các phần mềm phục vụ cho kiếm tiền online, như phần mềm youtube, phần mềm chạy facebook, phần mềm PTC, phần mềm gmail....
            </li>
            <li className="relative pl-5">
              <span className="absolute left-0 text-primary">•</span>
              <strong>Mua bán tài khoản:</strong> mua bán facebook, mua bán twitter, mua bán zalo, mua bán instagram.
            </li>
            <li className="relative pl-5">
              <span className="absolute left-0 text-primary">•</span>
              <strong>Các sản phẩm số khác:</strong> VPS, key window, key diệt virus, tất cả sản phẩm số không vi phạm chính sách của chúng tôi đều được phép kinh doanh trên trang.
            </li>
            <li className="relative pl-5">
              <span className="absolute left-0 text-primary">•</span>
              Các dịch vụ tăng tương tác (like, comment, share...), dịch vụ phần mềm, blockchain và các dịch vụ số khác.
            </li>
          </ul>
        </div>
      </Card>

      <div className="mt-4 flex justify-center">
        <Button 
          variant="success" 
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
        </Button>
      </div>
    </div>
  )
}
