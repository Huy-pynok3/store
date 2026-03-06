import { CategoryCard } from './ui'

const categories = [
  { name: 'Email', image: '/images/products/email-category.png', desc: 'Gmail, yahoo mail, hot mail... và những email khác', href: '/san-pham/email' },
  { name: 'Phần mềm', image: '/images/products/software-category.png', desc: 'Các phần mềm chuyên dụng cho kiếm tiền online như tool mmo', href: '/san-pham/phan-mem' },
  { name: 'Tài khoản', image: '/images/products/account-category.png', desc: 'Fb, Gmail, key website, supporter...', href: '/san-pham/tai-khoan' },
  { name: 'Khác', image: '/images/products/other-category.png', desc: 'Các sản phẩm số khác', href: '/san-pham/khac' },
]

export default function CategorySection() {
  return (
    <section className="mb-4">
      <h2 className="text-center text-primary text-xl font-semibold tracking-wide my-10">
        -- DANH SÁCH SẢN PHẨM --
      </h2>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.name}
            name={cat.name}
            image={cat.image}
            description={cat.desc}
            href={cat.href}
          />
        ))}
      </div>
    </section>
  )
}
