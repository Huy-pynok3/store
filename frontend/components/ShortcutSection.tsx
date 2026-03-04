'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Pagination } from './ui'

const shortcuts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=180&fit=crop',
    badge: 'Sản phẩm yêu thích',
    title: 'DỊCH VỤ TĂNG CÁC LOẠI TƯƠNG TÁC',
    category: 'Dịch vụ Tiktok',
    seller: 'minid990',
    price: '6 đ - 120 đ',
    rating: 4.5,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=180&fit=crop',
    badge: 'Sản phẩm đã mua',
    title: 'Dịch Vụ Gửi Liên Tiktok Bằng Seeder',
    category: 'Dịch vụ Tiktok',
    seller: 'ngotoan091',
    price: '20.000 đ',
    rating: 4,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=180&fit=crop',
    badge: 'Sản phẩm đã mua',
    title: 'Tài Khoản Tiktok SẢN 20K FL',
    category: 'Tài khoản Tiktok',
    seller: 'luilnh202',
    price: '99.000 đ - 449.000',
    rating: 5,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&h=180&fit=crop',
    badge: 'Sản phẩm yêu thích',
    title: 'Tài Khoản TikTokShop',
    category: 'Tài khoản Tiktok',
    seller: 'oscar_01jk65',
    price: '40.000 đ - 300.000 đ',
    rating: 4.5,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=180&fit=crop',
    badge: 'Sản phẩm đã mua',
    title: 'Tài Khoản Tiktok Seller',
    category: 'Tài khoản Tiktok',
    seller: 'ngotoan091',
    price: '1.000 đ - 20.000 đ',
    rating: 4,
  },
]

export default function ShortcutSection() {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <section className="mb-6">
      <h2 className="text-base font-semibold mb-3 text-gray-800">Lối tắt</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {shortcuts.map((item) => (
          <Link
            key={item.id}
            href={`/san-pham/${item.id}`}
            className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-sm transition-shadow"
          >
            <div className="relative">
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={180}
                className="w-full h-[130px] object-cover"
              />
              <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] font-medium px-1.5 py-0.5 rounded-sm">
                {item.badge}
              </span>
            </div>
            <div className="p-2.5">
              <div className="flex gap-0.5 text-yellow-400 text-[10px] mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={
                      i < Math.floor(item.rating)
                        ? 'fas fa-star'
                        : i < item.rating
                        ? 'fas fa-star-half-alt'
                        : 'far fa-star'
                    }
                  ></i>
                ))}
              </div>
              <h3 className="text-xs font-medium text-gray-800 mb-1.5 leading-tight line-clamp-2 min-h-[32px]">
                {item.title}
              </h3>
              <div className="text-[10px] text-gray-600 mb-0.5">
                Sản phẩm: {item.category}
              </div>
              <div className="text-[10px] text-gray-600 mb-1.5">
                Người bán: {item.seller}
              </div>
              <div className="text-xs font-semibold text-primary">
                {item.price}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={2}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  )
}
