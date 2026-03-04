import { Card, Button, ArticleCard } from './ui'

const articles = [
  {
    title: 'Tại sao nên chọn đầu tư nhà đất trong thời điểm này?',
    category: 'Tài chính',
    views: '1.8K0',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    icon: 'fas fa-chart-line'
  },
  {
    title: 'Hướng dẫn kiếm tiền online cho người mới bắt đầu',
    category: 'MMO',
    views: '2.3K',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    icon: 'fas fa-laptop-code'
  },
  {
    title: 'Bảo mật tài khoản: Những điều cần biết',
    category: 'Bảo mật',
    views: '1.5K',
    gradient: 'bg-gradient-to-br from-green-500 to-teal-500',
    icon: 'fas fa-shield-alt'
  }
]

export default function AdSidebar() {
  return (
    <aside className="sticky top-[110px] space-y-4">
      <Card>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Bài viết tham khảo
        </h3>
        <div className="space-y-3">
          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
      </Card>

      <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-sm p-6 text-white text-center">
        <i className="fas fa-bullhorn text-4xl mb-3"></i>
        <h3 className="text-lg font-bold mb-2">Quảng cáo tại đây</h3>
        <p className="text-sm mb-4">Tiếp cận hàng ngàn khách hàng tiềm năng</p>
        <Button variant="secondary" size="sm" className="bg-white text-orange-500 hover:bg-gray-100">
          Liên hệ ngay
        </Button>
      </div>
    </aside>
  )
}
