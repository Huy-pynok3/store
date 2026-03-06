import Link from 'next/link'
import Image from 'next/image'

interface CategoryCardProps {
  name: string
  image: string
  description: string
  href: string
}

export default function CategoryCard({ name, image, description, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="bg-white border border-[#9fdac0] rounded-sm p-8 text-center hover:border-primary transition-colors cursor-pointer min-h-[260px] flex flex-col items-center justify-start"
    >
      <div className="w-[84px] h-[84px] mb-5">
        <Image 
          src={image} 
          alt={name}
          width={84}
          height={84}
          className="w-[84px] h-[84px]"
        />
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
