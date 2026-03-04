import type { Metadata } from 'next'
import ProductDetail from '../../../components/ProductDetail'

export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm - TạpHóaMMO',
  description: 'Xem chi tiết sản phẩm',
}

// Mock data - sẽ thay bằng API call
const product = {
  id: 1,
  name: 'GMAIL VIỆT 2015-2019 - NGƯỜI DÙNG THẬT - CHƯA QUA DỊCH VỤ - HÀNG TRUST',
  rating: 4.5,
  reviews: 128,
  sold: 296041,
  complaints: '0.0%',
  seller: 'lanPhuong',
  sellerVerified: true,
  category: 'Gmail',
  stock: 2291,
  price: 20000,
  description: 'Shop chuyên cung cấp các loại Gmail Việt, Kênh Youtube Việt - Chất lượng uy tín số 1 Việt Nam',
  variants: [
    { id: 1, name: 'Gmail Việt 2016 - Chưa qua dịch vụ - Hàng Vip', price: 20000 },
    { id: 2, name: 'Gmail Việt 2019 - Chưa qua dịch vụ - Hàng Vip', price: 22000 },
    { id: 3, name: 'Gmail Việt 2018 - Chưa qua dịch vụ - Hàng Vip', price: 21000, selected: true },
    { id: 4, name: 'Gmail Việt 2015 - Chưa qua dịch vụ - Hàng Vip', price: 19000 },
  ],
  features: [
    'Tải được tất cả nền tảng video TRUNG QUỐC Window',
    'Tải được tất cả nền tảng video TRUNG QUỐC MACOS',
    'Tải được TIKTOK kết tất cả nền tảng trung quốc',
  ],
  image: '/products/gmail-viet.png',
}

const reviews = [
  {
    id: 1,
    username: 'v****nbet2024',
    rating: 5,
    comment: 'Ok',
    date: '11/03/2025',
    avatar: '/avatars/user1.png',
  },
  {
    id: 2,
    username: 'c****_emhozt',
    rating: 5,
    comment: 'Quá oke',
    date: '11/03/2025',
    avatar: '/avatars/user2.png',
  },
  {
    id: 3,
    username: 'z****_psnevz',
    rating: 5,
    comment: 'ủng hộ',
    date: '11/03/2025',
    avatar: '/avatars/user3.png',
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetail product={product} reviews={reviews} />
}
