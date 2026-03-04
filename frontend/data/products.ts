// Dữ liệu sản phẩm tập trung cho toàn bộ website

export interface Product {
  id: number
  badge: string
  stock: number
  name: string
  rating: number
  reviews: number
  sold: number
  complaints: string
  seller: string
  sellerVerified?: boolean
  category: string
  description: string
  features: string[]
  priceRange: string
  price?: number
  image: string
  variants?: Array<{
    id: number
    name: string
    price: number
    selected?: boolean
  }>
  detailedDescription?: string
}

export interface Review {
  id: number
  username: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

// Sản phẩm Email
export const emailProducts: Product[] = [
  {
    id: 1,
    badge: 'Sản phẩm',
    stock: 8261,
    name: 'Gmail New USA, hàng ngon, Reg IOS đã nghỉ >15 ngày',
    rating: 4.5,
    reviews: 128,
    sold: 108851,
    complaints: '0.0%',
    seller: 'leelangymail',
    sellerVerified: true,
    category: 'Gmail',
    description: 'Gmail USA - reg iOS | New 15-30 ngày (OLD) | IP USA, Name English',
    features: [
      'Gmail USA chất lượng cao, tạo từ IP USA',
      'Tên tiếng Anh, thông tin người dùng thật',
      'Đã nghỉ 15-30 ngày, tỷ lệ sống cao',
      'Bảo hành đổi mới trong 24h nếu lỗi'
    ],
    priceRange: '3.000 đ - 17.000 đ',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop',
    variants: [
      { id: 1, name: 'Gmail USA New 15 ngày', price: 17000 },
      { id: 2, name: 'Gmail USA New 20 ngày', price: 15000, selected: true },
      { id: 3, name: 'Gmail USA New 30 ngày', price: 12000 },
    ],
    detailedDescription: `
Gmail USA chất lượng cao được tạo từ IP Mỹ, thông tin người dùng thật với tên tiếng Anh. 
Tài khoản đã được nghỉ từ 15-30 ngày, đảm bảo tỷ lệ sống cao khi sử dụng.

Đặc điểm nổi bật:
- IP USA sạch, không bị blacklist
- Thông tin người dùng thật, có thể verify
- Tỷ lệ sống 95%+ khi sử dụng đúng cách
- Hỗ trợ đổi mới trong 24h nếu lỗi do nhà cung cấp

Lưu ý khi sử dụng:
- Đổi mật khẩu ngay sau khi nhận
- Không spam hoặc vi phạm chính sách Google
- Sử dụng proxy/VPN USA để tăng độ tin cậy
    `
  },
  {
    id: 2,
    badge: 'Sản phẩm',
    stock: 0,
    name: 'Gmail Random/US IP - Live trâu',
    rating: 4.8,
    reviews: 1731,
    sold: 3027593,
    complaints: '0.0%',
    seller: 'mailanpmail',
    sellerVerified: true,
    category: 'Gmail',
    description: 'Gmail Live trâu - Tỷ lệ sống 99%',
    features: [
      'Gmail Live tạo 24-48h, tỷ lệ sống 99%',
      'IP Random hoặc US tùy chọn',
      'Giá rẻ nhất thị trường',
      'Bảo hành giảm trong 7 ngày'
    ],
    priceRange: '2.400 đ - 6.684 đ',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=400&h=300&fit=crop',
    variants: [
      { id: 1, name: 'Gmail Random IP', price: 2400 },
      { id: 2, name: 'Gmail US IP', price: 4500, selected: true },
      { id: 3, name: 'Gmail US IP Premium', price: 6684 },
    ],
    detailedDescription: `
Gmail Live chất lượng cao với tỷ lệ sống lên đến 99%. Tài khoản được tạo trong vòng 24-48h, 
đảm bảo độ tươi và khả năng sử dụng lâu dài.

Ưu điểm:
- Tỷ lệ sống cực cao 99%
- Giá cả cạnh tranh nhất thị trường
- Hỗ trợ cả IP Random và US
- Bảo hành giảm trong 7 ngày

Phù hợp cho:
- Đăng ký dịch vụ, tạo tài khoản
- Sử dụng cho mục đích cá nhân
- Kinh doanh online, marketing
    `
  },
]

// Reviews cho từng sản phẩm
export const productReviews: Record<number, Review[]> = {
  1: [
    {
      id: 1,
      username: 'n****guyen2024',
      rating: 5,
      comment: 'Gmail chất lượng, đã mua nhiều lần rồi. Shop uy tín!',
      date: '04/03/2026',
    },
    {
      id: 2,
      username: 't****_marketing',
      rating: 5,
      comment: 'Hàng ngon, tỷ lệ sống cao. Sẽ ủng hộ dài dài',
      date: '03/03/2026',
    },
    {
      id: 3,
      username: 'v****shop',
      rating: 4,
      comment: 'Tốt, nhưng có 1-2 con die. Nhìn chung ok',
      date: '02/03/2026',
    },
    {
      id: 4,
      username: 'm****_dev',
      rating: 5,
      comment: 'Perfect! Đúng như mô tả',
      date: '01/03/2026',
    },
  ],
  2: [
    {
      id: 1,
      username: 'a****trader',
      rating: 5,
      comment: 'Giá rẻ mà chất lượng tốt. Recommend!',
      date: '04/03/2026',
    },
    {
      id: 2,
      username: 'k****_business',
      rating: 5,
      comment: 'Mua số lượng lớn, tỷ lệ sống như quảng cáo',
      date: '03/03/2026',
    },
  ],
}

// Helper function để lấy sản phẩm theo ID
export function getProductById(id: number): Product | undefined {
  const allProducts = [...emailProducts]
  return allProducts.find(p => p.id === id)
}

// Helper function để lấy reviews theo product ID
export function getReviewsByProductId(productId: number): Review[] {
  return productReviews[productId] || []
}


// Thêm sản phẩm Gmail còn lại
emailProducts.push(
  {
    id: 3,
    badge: 'Sản phẩm',
    stock: 0,
    name: 'GMAIL VIỆT 2015-2019 - NGƯỜI DÙNG THẬT - CHƯA QUA DỊCH VỤ - HÀNG TRUST',
    rating: 4.9,
    reviews: 826,
    sold: 18273,
    complaints: '0.0%',
    seller: 'lanPhuong',
    sellerVerified: true,
    category: 'Gmail',
    description: 'Shop chuyên cung cấp các loại Gmail Việt, Uy tín - Chất lượng',
    features: [
      'Gmail Việt 2015-2019 - Người dùng thật',
      'Chưa qua dịch vụ - Hàng Trust',
      'Thông tin đầy đủ, có thể verify',
      'Bảo hành đổi mới trong 3 ngày'
    ],
    priceRange: '19.000 đ - 23.000 đ',
    price: 21000,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    variants: [
      { id: 1, name: 'Gmail Việt 2015 - Chưa qua dịch vụ', price: 19000 },
      { id: 2, name: 'Gmail Việt 2018 - Chưa qua dịch vụ', price: 21000, selected: true },
      { id: 3, name: 'Gmail Việt 2019 - Chưa qua dịch vụ', price: 23000 },
    ],
    detailedDescription: `
Gmail Việt Nam chất lượng cao từ người dùng thật, được tạo từ năm 2015-2019. 
Tài khoản chưa qua dịch vụ nào, đảm bảo độ tin cậy và an toàn cao.

Đặc điểm:
- Người dùng Việt Nam thật 100%
- Thông tin đầy đủ, có thể verify
- Chưa qua dịch vụ, độ trust cao
- Phù hợp cho mục đích cá nhân và kinh doanh

Cam kết:
- Bảo hành đổi mới trong 3 ngày
- Hỗ trợ kỹ thuật 24/7
- Tỷ lệ sống 98%+
    `
  },
  {
    id: 4,
    badge: 'Sản phẩm',
    stock: 0,
    name: 'Gmail đã qua Dịch Vụ - Live Trâu',
    rating: 4.7,
    reviews: 932,
    sold: 815985,
    complaints: '0.0%',
    seller: 'mailanpmail',
    sellerVerified: true,
    category: 'Gmail',
    description: 'Gmail đã qua dịch vụ - Giá rẻ, chất lượng tốt',
    features: [
      'Gmail đã qua dịch vụ, giá rẻ',
      'Tỷ lệ sống cao 95%+',
      'Phù hợp cho spam, seeding',
      'Bảo hành giảm 3 ngày'
    ],
    priceRange: '2.400 đ - 6.684 đ',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=300&fit=crop',
    variants: [
      { id: 1, name: 'Gmail Random IP', price: 2400 },
      { id: 2, name: 'Gmail US IP', price: 3500, selected: true },
    ],
    detailedDescription: `
Gmail đã qua dịch vụ với giá cực kỳ cạnh tranh. Phù hợp cho các mục đích spam, seeding, 
hoặc các hoạt động marketing không yêu cầu độ trust cao.

Ưu điểm:
- Giá rẻ nhất thị trường
- Tỷ lệ sống vẫn đạt 95%+
- Số lượng lớn, giao hàng nhanh
- Phù hợp cho marketing, seeding
    `
  },
  {
    id: 5,
    badge: 'Sản phẩm',
    stock: 0,
    name: 'Gmail Trust Good',
    rating: 4.6,
    reviews: 74,
    sold: 51148,
    complaints: '0.0%',
    seller: 'leemail_myfbfan',
    sellerVerified: true,
    category: 'Gmail',
    description: 'Gmail Trust tốt - Phù hợp cho các dịch vụ quan trọng',
    features: [
      'Gmail Trust cao, độ tin cậy tốt',
      'Phù hợp cho dịch vụ quan trọng',
      'Tỷ lệ sống 97%+',
      'Bảo hành 5 ngày'
    ],
    priceRange: '5.000 đ - 15.000 đ',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=400&h=300&fit=crop',
    variants: [
      { id: 1, name: 'Gmail Trust Good', price: 10000, selected: true },
      { id: 2, name: 'Gmail Trust Premium', price: 15000 },
    ],
    detailedDescription: `
Gmail với độ trust tốt, phù hợp cho các dịch vụ yêu cầu độ tin cậy cao như đăng ký 
tài khoản ngân hàng, ví điện tử, hoặc các dịch vụ quan trọng khác.

Đặc điểm:
- Độ trust cao, ít bị checkpoint
- Thông tin người dùng đầy đủ
- Tỷ lệ sống 97%+
- Bảo hành 5 ngày
    `
  }
)

// Thêm reviews cho các sản phẩm mới
productReviews[3] = [
  {
    id: 1,
    username: 'h****_shop',
    rating: 5,
    comment: 'Gmail Việt chất lượng, thông tin đầy đủ. Recommend!',
    date: '04/03/2026',
  },
  {
    id: 2,
    username: 'p****_business',
    rating: 5,
    comment: 'Hàng trust, dùng ổn định',
    date: '03/03/2026',
  },
  {
    id: 3,
    username: 'l****_marketing',
    rating: 4,
    comment: 'Tốt, có 1 con die nhưng shop đổi nhanh',
    date: '02/03/2026',
  },
]

productReviews[4] = [
  {
    id: 1,
    username: 's****_seeding',
    rating: 5,
    comment: 'Giá rẻ mà chất lượng ok. Dùng spam tốt',
    date: '04/03/2026',
  },
  {
    id: 2,
    username: 'd****_mmo',
    rating: 4,
    comment: 'Tỷ lệ sống như quảng cáo, ổn',
    date: '03/03/2026',
  },
]

productReviews[5] = [
  {
    id: 1,
    username: 't****_fintech',
    rating: 5,
    comment: 'Gmail trust tốt, dùng đăng ký ví điện tử ok',
    date: '04/03/2026',
  },
  {
    id: 2,
    username: 'n****_dev',
    rating: 5,
    comment: 'Chất lượng tốt, sẽ mua thêm',
    date: '03/03/2026',
  },
]
