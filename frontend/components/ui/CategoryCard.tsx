import Link from 'next/link'

interface CategoryCardProps {
  name: string
  icon: string
  description: string
  href: string
}

export default function CategoryCard({ name, icon, description, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="bg-white border border-[#9fdac0] rounded-sm p-8 text-center hover:border-primary transition-colors cursor-pointer min-h-[260px] flex flex-col items-center justify-start"
    >
      <div className="w-[84px] h-[84px] bg-primary rounded-full flex items-center justify-center mb-5">
        <i className={`${icon} text-white text-[40px]`}></i>
      </div>
      <h3 className="text-[17px] font-semibold text-primary mb-2.5 leading-tight">
        {name}
      </h3>
      <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-3">
        {description}
      </p>
    </Link>
  )
}
