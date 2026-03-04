import { CategoryCard } from './ui'

const services = [
  { name: 'Tăng tương tác', icon: 'fas fa-chart-line', desc: 'Tăng like, view share, comment... cho sản phẩm của bạn', href: '/dich-vu/tang-tuong-tac' },
  { name: 'Dịch vụ phần mềm', icon: 'fas fa-tools', desc: 'Dịch vụ code tool MMO, dò hoa, video... và các dịch vụ liên quan', href: '/dich-vu/phan-mem' },
  { name: 'Blockchain', icon: 'fas fa-link', desc: 'Dịch vụ tiền ảo, NFT, coinlist... và các dịch vụ blockchain khác', href: '/dich-vu/blockchain' },
  { name: 'Dịch vụ khác', icon: 'fas fa-handshake', desc: 'Các dịch vụ MMO phổ biến khác hiện nay', href: '/dich-vu/khac' },
]

export default function ServiceSection() {
  return (
    <section className="mb-4">
      <h2 className="text-center text-primary text-xl font-semibold tracking-wide my-10">
        -- DANH SÁCH DỊCH VỤ --
      </h2>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
        {services.map((service) => (
          <CategoryCard
            key={service.name}
            name={service.name}
            icon={service.icon}
            description={service.desc}
            href={service.href}
          />
        ))}
      </div>
    </section>
  )
}
