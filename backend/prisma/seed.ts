import { PrismaClient, ListingKind, ListingCategory, ProductSubType, ProductType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function upsertProduct(data: {
  slug: string;
  name: string;
  shopId: string;
  shopKey: string;
  kind: ListingKind;
  category: ListingCategory;
  type: ProductType;
  subType: ProductSubType;
  badgeText?: string | null;
  shortDescription?: string;
  description: string;
  images: string[];
  stock: number;
  sold: number;
  completedOrders: number;
  reviewCount: number;
  ratingAvg: Decimal;
  complaintPercent: Decimal;
  price: number;
  features: string[];
  priceOptions: { label: string; price: Decimal; stock: number }[];
}) {
  const { features, priceOptions, shopKey, ...productFields } = data;

  const product = await prisma.product.upsert({
    where: { slug: data.slug },
    update: {
      ...productFields,
      autoDeliver: true,
      isActive: true,
    },
    create: {
      ...productFields,
      autoDeliver: true,
      isActive: true,
    },
  });

  // Delete old features/priceOptions and recreate
  await prisma.productFeature.deleteMany({ where: { productId: product.id } });
  await prisma.productPriceOption.deleteMany({ where: { productId: product.id } });

  for (let i = 0; i < features.length; i++) {
    await prisma.productFeature.create({
      data: { productId: product.id, content: features[i], sortOrder: i },
    });
  }

  for (const option of priceOptions) {
    await prisma.productPriceOption.create({
      data: {
        productId: product.id,
        label: option.label,
        price: option.price,
        stock: option.stock,
        isActive: true,
      },
    });
  }

  console.log(`✅ Upserted: ${product.name}`);
  return product;
}

async function main() {
  console.log('🌱 Starting seed...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taphoammo.com' },
    update: {
      username: 'taphoammo',
      fullName: 'TapHoaMMO Admin',
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: 'admin@taphoammo.com',
      username: 'taphoammo',
      passwordHash: '$2b$10$ItCe5i3yTmuu1uMjd3oGWedszrTkxjywDMlXeRKRIGGQHyvX8WJCW',
      fullName: 'TapHoaMMO Admin',
      role: 'ADMIN',
      balance: new Decimal(0),
      isActive: true,
    },
  });
  console.log(`✅ Upserted admin: ${admin.username}`);


  // ─── SELLERS & SHOPS ───────────────────────────────────────────────────────
  const sellerData = [
    { email: 'seller1@taphoammo.com', username: 'leelangymail', fullName: 'Lee Lang', shopName: 'leelangymail', shopDesc: 'Chuyên cung cấp Gmail chất lượng cao', rating: 4.8, totalSales: 108851 },
    { email: 'seller2@taphoammo.com', username: 'techstore99', fullName: 'Tech Store', shopName: 'techstore99', shopDesc: 'Phần mềm và tài khoản uy tín', rating: 4.5, totalSales: 45230 },
    { email: 'seller3@taphoammo.com', username: 'accountpro', fullName: 'Account Pro', shopName: 'accountpro', shopDesc: 'Tài khoản mạng xã hội và gaming uy tín', rating: 4.7, totalSales: 32100 },
    { email: 'seller4@taphoammo.com', username: 'socialboom', fullName: 'Social Boom', shopName: 'socialboom', shopDesc: 'Dịch vụ tăng tương tác chuyên nghiệp', rating: 4.6, totalSales: 67800 },
    { email: 'seller5@taphoammo.com', username: 'blockchainvn', fullName: 'Blockchain VN', shopName: 'blockchainvn', shopDesc: 'Dịch vụ blockchain và smart contract', rating: 4.4, totalSales: 12400 },
    { email: 'seller6@taphoammo.com', username: 'devmaster', fullName: 'Dev Master', shopName: 'devmaster', shopDesc: 'Phát triển phần mềm theo yêu cầu', rating: 4.9, totalSales: 8900 },
    { email: 'seller7@taphoammo.com', username: 'streamkeys', fullName: 'Stream Keys', shopName: 'streamkeys', shopDesc: 'Tài khoản streaming và entertainment', rating: 4.3, totalSales: 28500 },
    { email: 'seller8@taphoammo.com', username: 'gameshop88', fullName: 'Game Shop 88', shopName: 'gameshop88', shopDesc: 'Tài khoản game chất lượng cao', rating: 4.6, totalSales: 54200 },
  ];

  const shops: Record<string, string> = {};

  for (const s of sellerData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        username: s.username,
        passwordHash: '$2b$10$dummyhash',
        fullName: s.fullName,
        role: 'SELLER',
        balance: new Decimal(0),
      },
    });
    const shop = await prisma.shop.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: s.shopName,
        description: s.shopDesc,
        rating: s.rating,
        totalSales: s.totalSales,
      },
    });
    shops[s.username] = shop.id;
  }

  // ─── EMAIL PRODUCTS ─────────────────────────────────────────────────────────
  const emailProducts = [
    {
      slug: 'gmail-new-usa-reg-ios', name: 'Gmail New USA, hàng ngon, Reg IOS đã nghỉ >15 ngày',
      subType: ProductSubType.GMAIL, badgeText: 'KHÔNG TRÙNG',
      shortDescription: 'Gmail USA chất lượng cao, tạo từ IP USA',
      description: 'Gmail USA - reg iOS | New 15-30 ngày (OLD) | IP USA, Name English. Gmail USA chất lượng cao, tạo từ IP USA, tên tiếng Anh, thông tin người dùng thật.',
      images: ['https://images.unsplash.com/photo-1596526131083-e8c633064dcd?w=400&h=300&fit=crop'], stock: 8261, sold: 15420, completedOrders: 108851, reviewCount: 128, ratingAvg: new Decimal(4.0), complaintPercent: new Decimal(0.0),
      features: ['Gmail USA - reg iOS | New 15-30 ngày (OLD) | IP USA, Name English', 'Gmail USA chất lượng cao, tạo từ IP USA', 'Tên tiếng Anh, thông tin người dùng thật'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(3000), stock: 8261 }, { label: '10 tài khoản', price: new Decimal(27000), stock: 826 }, { label: '50 tài khoản', price: new Decimal(125000), stock: 165 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'gmail-vn-reg-phone', name: 'Gmail Việt Nam - Reg Phone - Tên Việt',
      subType: ProductSubType.GMAIL, badgeText: 'HOT',
      shortDescription: 'Gmail VN reg bằng số điện thoại Việt Nam',
      description: 'Gmail Việt Nam được đăng ký bằng số điện thoại thật, tên người dùng tiếng Việt, phù hợp cho thị trường nội địa.',
      images: ['https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=300&fit=crop'], stock: 5420, sold: 8930, completedOrders: 45230, reviewCount: 89, ratingAvg: new Decimal(4.2), complaintPercent: new Decimal(0.5),
      features: ['Gmail VN - Reg Phone | Tên Việt', 'Đăng ký bằng SIM Việt Nam thật', 'Phù hợp thị trường nội địa'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(2500), stock: 5420 }, { label: '10 tài khoản', price: new Decimal(22000), stock: 542 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'gmail-aged-3year', name: 'Gmail Aged 3+ Năm - Độ Tin Cậy Cao',
      subType: ProductSubType.GMAIL, badgeText: 'AGED',
      shortDescription: 'Gmail cũ hơn 3 năm, recovery đầy đủ',
      description: 'Gmail Aged accounts đã sử dụng trên 3 năm, recovery phone/email đầy đủ, độ tin cậy cao cho marketing.',
      images: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop'], stock: 2100, sold: 4500, completedOrders: 23400, reviewCount: 67, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.2),
      features: ['Gmail aged 3+ năm', 'Recovery phone/email đầy đủ', 'Độ tin cậy cao'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(8000), stock: 2100 }, { label: '5 tài khoản', price: new Decimal(37000), stock: 420 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'gmail-pva-uk', name: 'Gmail PVA UK - Đăng Ký SIM UK',
      subType: ProductSubType.GMAIL, badgeText: null,
      shortDescription: 'Gmail đăng ký SIM UK thật',
      description: 'Gmail PVA (Phone Verified Account) đăng ký bằng SIM UK thật, IP UK, tên tiếng Anh.',
      images: ['https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop'], stock: 3200, sold: 6100, completedOrders: 31200, reviewCount: 54, ratingAvg: new Decimal(4.1), complaintPercent: new Decimal(0.8),
      features: ['Gmail PVA UK', 'SIM UK thật', 'IP UK, tên tiếng Anh'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(4500), stock: 3200 }, { label: '10 tài khoản', price: new Decimal(40000), stock: 320 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'hotmail-premium-aged', name: 'Hotmail Premium - Aged 2+ years',
      subType: ProductSubType.HOTMAIL, badgeText: 'PREMIUM',
      shortDescription: 'Hotmail cũ trên 2 năm, độ tin cậy cao',
      description: 'Hotmail/Outlook aged accounts, đã sử dụng trên 2 năm, độ tin cậy cao, phù hợp cho email marketing.',
      images: ['https://images.unsplash.com/photo-1587176487310-8f7d91751ddd?w=400&h=300&fit=crop'], stock: 1250, sold: 3420, completedOrders: 12450, reviewCount: 45, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.2),
      features: ['Hotmail/Outlook aged 2+ years', 'Độ tin cậy cao', 'Phù hợp email marketing'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(5000), stock: 1250 }, { label: '10 tài khoản', price: new Decimal(45000), stock: 125 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'hotmail-new-pva', name: 'Hotmail New PVA - Xác Minh SĐT',
      subType: ProductSubType.HOTMAIL, badgeText: 'NEW',
      shortDescription: 'Hotmail mới xác minh số điện thoại',
      description: 'Hotmail mới tạo, đã xác minh số điện thoại, phù hợp đăng ký dịch vụ.',
      images: ['https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop'], stock: 890, sold: 1540, completedOrders: 7200, reviewCount: 28, ratingAvg: new Decimal(4.0), complaintPercent: new Decimal(1.0),
      features: ['Hotmail new PVA', 'Xác minh SĐT', 'Mới tạo chất lượng'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(3500), stock: 890 }, { label: '10 tài khoản', price: new Decimal(32000), stock: 89 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'outlook-business-verified', name: 'Outlook Mail Business - Verified',
      subType: ProductSubType.OUTLOOKMAIL, badgeText: 'BUSINESS',
      shortDescription: 'Outlook Business đã xác minh',
      description: 'Outlook Business accounts, đã xác minh đầy đủ, phù hợp cho doanh nghiệp.',
      images: ['https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=400&h=300&fit=crop'], stock: 850, sold: 1240, completedOrders: 5680, reviewCount: 32, ratingAvg: new Decimal(4.7), complaintPercent: new Decimal(0.1),
      features: ['Outlook Business verified', 'Xác minh đầy đủ', 'Phù hợp doanh nghiệp'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(8000), stock: 850 }, { label: '5 tài khoản', price: new Decimal(37000), stock: 170 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'outlook-edu-free', name: 'Outlook EDU - Tài Khoản Giáo Dục',
      subType: ProductSubType.OUTLOOKMAIL, badgeText: 'EDU',
      shortDescription: 'Outlook edu miễn phí lưu trữ không giới hạn',
      description: 'Outlook Education accounts với lưu trữ không giới hạn, OneDrive 1TB.',
      images: ['https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=300&fit=crop'], stock: 420, sold: 780, completedOrders: 3400, reviewCount: 22, ratingAvg: new Decimal(4.3), complaintPercent: new Decimal(0.5),
      features: ['Outlook EDU unlimited storage', 'OneDrive 1TB', 'Office Online miễn phí'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(15000), stock: 420 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'iuumail-premium', name: 'IuuMail - Email Tạm Thời Cao Cấp',
      subType: ProductSubType.IUUMAIL, badgeText: null,
      shortDescription: 'IuuMail premium với nhiều tính năng',
      description: 'IuuMail premium accounts với nhiều tính năng nâng cao.',
      images: ['https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?w=400&h=300&fit=crop'], stock: 450, sold: 820, completedOrders: 2340, reviewCount: 18, ratingAvg: new Decimal(4.1), complaintPercent: new Decimal(0.8),
      features: ['IuuMail premium', 'Nhiều tính năng nâng cao', 'Hỗ trợ 24/7'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(4000), stock: 450 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'domain-mail-custom', name: 'Domain Mail - Email Tên Miền Riêng',
      subType: ProductSubType.DOMAINMAIL, badgeText: 'CUSTOM',
      shortDescription: 'Email tên miền riêng chuyên nghiệp',
      description: 'Email với tên miền riêng, chuyên nghiệp cho doanh nghiệp.',
      images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'], stock: 320, sold: 540, completedOrders: 1890, reviewCount: 24, ratingAvg: new Decimal(4.6), complaintPercent: new Decimal(0.3),
      features: ['Email tên miền riêng', 'Chuyên nghiệp', 'Setup miễn phí'],
      priceOptions: [{ label: '1 email', price: new Decimal(15000), stock: 320 }, { label: '5 email', price: new Decimal(70000), stock: 64 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'yahoo-mail-aged', name: 'Yahoo Mail - Aged Accounts',
      subType: ProductSubType.YAHOOMAIL, badgeText: null,
      shortDescription: 'Yahoo Mail tài khoản cũ',
      description: 'Yahoo Mail accounts đã sử dụng lâu năm.',
      images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'], stock: 680, sold: 1120, completedOrders: 4560, reviewCount: 28, ratingAvg: new Decimal(3.9), complaintPercent: new Decimal(1.2),
      features: ['Yahoo Mail aged', 'Tài khoản cũ', 'Giá tốt'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(3500), stock: 680 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'yahoo-pva-usa', name: 'Yahoo PVA USA - Xác Minh Phone',
      subType: ProductSubType.YAHOOMAIL, badgeText: 'PVA',
      shortDescription: 'Yahoo PVA đăng ký SIM USA',
      description: 'Yahoo Mail PVA đăng ký bằng SIM USA thật, IP USA.',
      images: ['https://images.unsplash.com/photo-1596526131083-e8c633064dcd?w=400&h=300&fit=crop'], stock: 340, sold: 560, completedOrders: 2100, reviewCount: 14, ratingAvg: new Decimal(4.0), complaintPercent: new Decimal(1.5),
      features: ['Yahoo PVA USA', 'SIM USA thật', 'IP USA'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(5500), stock: 340 }, { label: '5 tài khoản', price: new Decimal(25000), stock: 68 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'protonmail-secure', name: 'ProtonMail - Bảo Mật Cao',
      subType: ProductSubType.PROTONMAIL, badgeText: 'SECURE',
      shortDescription: 'ProtonMail mã hóa end-to-end',
      description: 'ProtonMail với mã hóa end-to-end, bảo mật tối đa.',
      images: ['https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'], stock: 180, sold: 340, completedOrders: 1240, reviewCount: 15, ratingAvg: new Decimal(4.8), complaintPercent: new Decimal(0.0),
      features: ['ProtonMail encrypted', 'Bảo mật tối đa', 'Privacy-focused'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(12000), stock: 180 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'protonmail-plus', name: 'ProtonMail Plus - Gói Nâng Cao',
      subType: ProductSubType.PROTONMAIL, badgeText: 'PLUS',
      shortDescription: 'ProtonMail Plus 1 năm',
      description: 'ProtonMail Plus subscription 1 năm, thêm dung lượng và tính năng.',
      images: ['https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=300&fit=crop'], stock: 90, sold: 180, completedOrders: 720, reviewCount: 8, ratingAvg: new Decimal(4.9), complaintPercent: new Decimal(0.0),
      features: ['ProtonMail Plus 1 năm', '5GB lưu trữ', 'Custom domain'],
      priceOptions: [{ label: '1 năm', price: new Decimal(89000), stock: 90 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'email-other-mix', name: 'Email Khác - Mix Nhiều Loại',
      subType: ProductSubType.OTHER_MAIL, badgeText: null,
      shortDescription: 'Mix nhiều loại email khác nhau',
      description: 'Gói mix nhiều loại email: Zoho, GMX, Mail.com, v.v.',
      images: ['https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop'], stock: 520, sold: 780, completedOrders: 2890, reviewCount: 21, ratingAvg: new Decimal(3.8), complaintPercent: new Decimal(1.5),
      features: ['Mix nhiều loại email', 'Giá rẻ', 'Đa dạng'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(2000), stock: 520 }, { label: '10 tài khoản', price: new Decimal(18000), stock: 52 }],
      shopKey: 'leelangymail',
    },
    {
      slug: 'zoho-mail-business', name: 'Zoho Mail Business - Email Doanh Nghiệp',
      subType: ProductSubType.OTHER_MAIL, badgeText: 'BUSINESS',
      shortDescription: 'Zoho Mail cho doanh nghiệp',
      description: 'Zoho Mail Business edition, phù hợp cho team và doanh nghiệp nhỏ.',
      images: ['https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=400&h=300&fit=crop'], stock: 210, sold: 380, completedOrders: 1560, reviewCount: 12, ratingAvg: new Decimal(4.2), complaintPercent: new Decimal(0.5),
      features: ['Zoho Mail Business', '50GB lưu trữ/user', 'Calendar & Contacts'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(25000), stock: 210 }],
      shopKey: 'techstore99',
    },
  ];

  for (const p of emailProducts) {
    await upsertProduct({ ...p, shopId: shops[p.shopKey], kind: ListingKind.PRODUCT, category: ListingCategory.EMAIL, type: ProductType.EMAIL, price: Number(p.priceOptions[0].price) });
  }

  // ─── SOFTWARE PRODUCTS ───────────────────────────────────────────────────────
  const softwareProducts = [
    {
      slug: 'windows-11-pro-lifetime', name: 'Windows 11 Pro - Bản Quyền Vĩnh Viễn',
      subType: ProductSubType.WINDOWS_SOFTWARE, badgeText: 'LIFETIME',
      shortDescription: 'Windows 11 Pro bản quyền vĩnh viễn',
      description: 'Windows 11 Pro genuine license, kích hoạt vĩnh viễn, hỗ trợ cài đặt.',
      images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop'], stock: 450, sold: 1240, completedOrders: 5680, reviewCount: 67, ratingAvg: new Decimal(4.6), complaintPercent: new Decimal(0.3),
      features: ['Windows 11 Pro genuine', 'Kích hoạt vĩnh viễn', 'Hỗ trợ cài đặt miễn phí'],
      priceOptions: [{ label: '1 license', price: new Decimal(150000), stock: 450 }, { label: '5 licenses', price: new Decimal(700000), stock: 90 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'windows-10-pro-lifetime', name: 'Windows 10 Pro - Bản Quyền Vĩnh Viễn',
      subType: ProductSubType.WINDOWS_SOFTWARE, badgeText: 'LIFETIME',
      shortDescription: 'Windows 10 Pro bản quyền vĩnh viễn',
      description: 'Windows 10 Pro genuine license key, kích hoạt vĩnh viễn.',
      images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop'], stock: 680, sold: 2100, completedOrders: 9800, reviewCount: 98, ratingAvg: new Decimal(4.7), complaintPercent: new Decimal(0.2),
      features: ['Windows 10 Pro genuine', 'Kích hoạt vĩnh viễn', 'Hỗ trợ upgrade lên Win 11'],
      priceOptions: [{ label: '1 license', price: new Decimal(120000), stock: 680 }, { label: '5 licenses', price: new Decimal(550000), stock: 136 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'office-365-1year', name: 'Microsoft Office 365 - 1 Năm',
      subType: ProductSubType.WINDOWS_SOFTWARE, badgeText: '1 NĂM',
      shortDescription: 'Office 365 bản quyền 1 năm',
      description: 'Microsoft Office 365 subscription 1 năm, đầy đủ ứng dụng.',
      images: ['https://images.unsplash.com/photo-1588200908342-23b585c03e26?w=400&h=300&fit=crop'], stock: 680, sold: 2340, completedOrders: 12450, reviewCount: 98, ratingAvg: new Decimal(4.7), complaintPercent: new Decimal(0.2),
      features: ['Office 365 subscription', 'Đầy đủ ứng dụng', 'Hỗ trợ 5 thiết bị'],
      priceOptions: [{ label: '1 năm', price: new Decimal(280000), stock: 680 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'office-2021-lifetime', name: 'Microsoft Office 2021 - Vĩnh Viễn',
      subType: ProductSubType.WINDOWS_SOFTWARE, badgeText: 'LIFETIME',
      shortDescription: 'Office 2021 bản quyền vĩnh viễn',
      description: 'Microsoft Office 2021 Home & Business, kích hoạt vĩnh viễn.',
      images: ['https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400&h=300&fit=crop'], stock: 320, sold: 890, completedOrders: 4200, reviewCount: 54, ratingAvg: new Decimal(4.8), complaintPercent: new Decimal(0.1),
      features: ['Office 2021 Home & Business', 'Kích hoạt vĩnh viễn', 'Word, Excel, PowerPoint, Outlook'],
      priceOptions: [{ label: '1 license', price: new Decimal(450000), stock: 320 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'adobe-cc-all-apps', name: 'Adobe Creative Cloud - All Apps',
      subType: ProductSubType.MAC_SOFTWARE, badgeText: 'ALL APPS',
      shortDescription: 'Adobe CC đầy đủ ứng dụng',
      description: 'Adobe Creative Cloud với tất cả ứng dụng: Photoshop, Illustrator, Premiere, v.v.',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop'], stock: 320, sold: 890, completedOrders: 4560, reviewCount: 54, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.5),
      features: ['Adobe CC All Apps', 'Photoshop, Illustrator, Premiere', 'Cập nhật liên tục'],
      priceOptions: [{ label: '1 tháng', price: new Decimal(120000), stock: 320 }, { label: '6 tháng', price: new Decimal(650000), stock: 64 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'adobe-photoshop-1year', name: 'Adobe Photoshop - 1 Năm',
      subType: ProductSubType.MAC_SOFTWARE, badgeText: '1 NĂM',
      shortDescription: 'Adobe Photoshop subscription 1 năm',
      description: 'Adobe Photoshop CC subscription 1 năm, bản chính hãng.',
      images: ['https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=300&fit=crop'], stock: 210, sold: 540, completedOrders: 2800, reviewCount: 34, ratingAvg: new Decimal(4.6), complaintPercent: new Decimal(0.3),
      features: ['Adobe Photoshop CC', 'Cập nhật liên tục', '100GB cloud storage'],
      priceOptions: [{ label: '1 năm', price: new Decimal(380000), stock: 210 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'antivirus-kaspersky-1year', name: 'Kaspersky Total Security - 1 Năm 3 PC',
      subType: ProductSubType.WINDOWS_SOFTWARE, badgeText: 'SECURITY',
      shortDescription: 'Kaspersky Total Security bảo vệ 3 máy tính',
      description: 'Kaspersky Total Security 1 năm, bảo vệ 3 thiết bị, chống virus & malware.',
      images: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'], stock: 540, sold: 1800, completedOrders: 8900, reviewCount: 112, ratingAvg: new Decimal(4.4), complaintPercent: new Decimal(0.6),
      features: ['Kaspersky Total Security', 'Bảo vệ 3 thiết bị', 'Chống virus & malware real-time'],
      priceOptions: [{ label: '1 năm 3 PC', price: new Decimal(180000), stock: 540 }, { label: '2 năm 3 PC', price: new Decimal(320000), stock: 108 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'vpn-nordvpn-1year', name: 'NordVPN - 1 Năm 6 Thiết Bị',
      subType: ProductSubType.MOBILE_APP, badgeText: 'VPN',
      shortDescription: 'NordVPN bảo mật truy cập internet',
      description: 'NordVPN subscription 1 năm, 6 thiết bị đồng thời, 5400+ servers.',
      images: ['https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=300&fit=crop'], stock: 380, sold: 920, completedOrders: 4100, reviewCount: 76, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.4),
      features: ['NordVPN 1 năm', '6 thiết bị đồng thời', '5400+ servers toàn cầu'],
      priceOptions: [{ label: '1 năm', price: new Decimal(250000), stock: 380 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'canva-pro-1year', name: 'Canva Pro - 1 Năm',
      subType: ProductSubType.WEB_APP, badgeText: 'PRO',
      shortDescription: 'Canva Pro thiết kế chuyên nghiệp',
      description: 'Canva Pro 1 năm, mở khóa tất cả template và tính năng premium.',
      images: ['https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400&h=300&fit=crop'], stock: 290, sold: 720, completedOrders: 3200, reviewCount: 88, ratingAvg: new Decimal(4.8), complaintPercent: new Decimal(0.2),
      features: ['Canva Pro 1 năm', 'Tất cả template premium', 'Tải không giới hạn'],
      priceOptions: [{ label: '1 năm', price: new Decimal(200000), stock: 290 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'chatgpt-plus-1month', name: 'ChatGPT Plus - 1 Tháng',
      subType: ProductSubType.WEB_APP, badgeText: 'AI',
      shortDescription: 'ChatGPT Plus GPT-4 không giới hạn',
      description: 'ChatGPT Plus 1 tháng, truy cập GPT-4 không giới hạn, ưu tiên tốc độ.',
      images: ['https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=300&fit=crop'], stock: 480, sold: 1560, completedOrders: 6700, reviewCount: 134, ratingAvg: new Decimal(4.7), complaintPercent: new Decimal(0.3),
      features: ['ChatGPT Plus 1 tháng', 'GPT-4 không giới hạn', 'Ưu tiên tốc độ & tính năng mới'],
      priceOptions: [{ label: '1 tháng', price: new Decimal(320000), stock: 480 }, { label: '3 tháng', price: new Decimal(900000), stock: 160 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'grammarly-premium-1year', name: 'Grammarly Premium - 1 Năm',
      subType: ProductSubType.WEB_APP, badgeText: 'PREMIUM',
      shortDescription: 'Grammarly Premium kiểm tra văn phong',
      description: 'Grammarly Premium 1 năm, kiểm tra ngữ pháp, văn phong, đạo văn.',
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'], stock: 220, sold: 580, completedOrders: 2400, reviewCount: 45, ratingAvg: new Decimal(4.6), complaintPercent: new Decimal(0.2),
      features: ['Grammarly Premium 1 năm', 'Kiểm tra ngữ pháp nâng cao', 'Phát hiện đạo văn'],
      priceOptions: [{ label: '1 năm', price: new Decimal(280000), stock: 220 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'autocad-2024-license', name: 'AutoCAD 2024 - Bản Quyền 1 Năm',
      subType: ProductSubType.WINDOWS_SOFTWARE, badgeText: 'CAD',
      shortDescription: 'AutoCAD 2024 thiết kế kỹ thuật',
      description: 'AutoCAD 2024 subscription 1 năm, phần mềm thiết kế kỹ thuật chuyên nghiệp.',
      images: ['https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop'], stock: 80, sold: 190, completedOrders: 890, reviewCount: 18, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.5),
      features: ['AutoCAD 2024 subscription', 'Thiết kế 2D & 3D', 'AutoCAD web & mobile'],
      priceOptions: [{ label: '1 năm', price: new Decimal(1200000), stock: 80 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'spotify-premium-3months', name: 'Spotify Premium - 3 Tháng',
      subType: ProductSubType.MOBILE_APP, badgeText: 'MUSIC',
      shortDescription: 'Spotify Premium nghe nhạc không quảng cáo',
      description: 'Spotify Premium 3 tháng, nghe nhạc không giới hạn, không quảng cáo, offline.',
      images: ['https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=400&h=300&fit=crop'], stock: 650, sold: 2100, completedOrders: 9800, reviewCount: 167, ratingAvg: new Decimal(4.3), complaintPercent: new Decimal(1.0),
      features: ['Spotify Premium 3 tháng', 'Không quảng cáo', 'Nghe offline'],
      priceOptions: [{ label: '3 tháng', price: new Decimal(90000), stock: 650 }, { label: '1 năm', price: new Decimal(320000), stock: 130 }],
      shopKey: 'streamkeys',
    },
  ];

  for (const p of softwareProducts) {
    await upsertProduct({ ...p, shopId: shops[p.shopKey], kind: ListingKind.PRODUCT, category: ListingCategory.PRODUCT_SOFTWARE, type: ProductType.SOFTWARE, price: Number(p.priceOptions[0].price) });
  }

  // ─── ACCOUNT PRODUCTS ────────────────────────────────────────────────────────
  const accountProducts = [
    {
      slug: 'facebook-account-aged-pva', name: 'Facebook Aged PVA - Tài Khoản Cũ Xác Minh SĐT',
      subType: ProductSubType.SOCIAL_ACCOUNT, badgeText: 'AGED',
      shortDescription: 'Facebook cũ xác minh SĐT, bạn bè thật',
      description: 'Facebook Aged PVA (Phone Verified Account) trên 1 năm, có bạn bè thật, phù hợp chạy quảng cáo.',
      images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop'], stock: 3200, sold: 8900, completedOrders: 42000, reviewCount: 234, ratingAvg: new Decimal(4.3), complaintPercent: new Decimal(1.2),
      features: ['Facebook Aged 1+ năm', 'PVA xác minh SĐT', 'Có bạn bè thật', 'Phù hợp chạy ads'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(25000), stock: 3200 }, { label: '5 tài khoản', price: new Decimal(115000), stock: 640 }, { label: '10 tài khoản', price: new Decimal(220000), stock: 320 }],
      shopKey: 'accountpro',
    },
    {
      slug: 'facebook-bm-verified', name: 'Facebook Business Manager - Đã Xác Minh',
      subType: ProductSubType.SOCIAL_ACCOUNT, badgeText: 'BM',
      shortDescription: 'Facebook BM xác minh, chạy ads ngay',
      description: 'Facebook Business Manager đã xác minh doanh nghiệp, có thể chạy quảng cáo ngay lập tức.',
      images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'], stock: 850, sold: 2100, completedOrders: 10500, reviewCount: 145, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.8),
      features: ['Facebook BM verified', 'Chạy ads ngay', 'Limit ads cao', 'Hỗ trợ setup'],
      priceOptions: [{ label: '1 BM', price: new Decimal(180000), stock: 850 }, { label: '3 BM', price: new Decimal(500000), stock: 283 }],
      shopKey: 'accountpro',
    },
    {
      slug: 'tiktok-account-1k-follower', name: 'TikTok Account 1K+ Follower - Tài Khoản Có Sẵn Follower',
      subType: ProductSubType.SOCIAL_ACCOUNT, badgeText: 'FOLLOWERS',
      shortDescription: 'TikTok 1000+ followers thật',
      description: 'Tài khoản TikTok với 1000+ followers thật, niche lifestyle, phù hợp bán hàng.',
      images: ['https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=300&fit=crop'], stock: 420, sold: 980, completedOrders: 4500, reviewCount: 89, ratingAvg: new Decimal(4.4), complaintPercent: new Decimal(1.0),
      features: ['TikTok 1K+ followers thật', 'Niche đa dạng', 'Phù hợp affiliate & bán hàng'],
      priceOptions: [{ label: '1 tài khoản 1K', price: new Decimal(150000), stock: 420 }, { label: '1 tài khoản 5K', price: new Decimal(450000), stock: 84 }],
      shopKey: 'accountpro',
    },
    {
      slug: 'instagram-pva-aged', name: 'Instagram Aged PVA - Tài Khoản Cũ',
      subType: ProductSubType.SOCIAL_ACCOUNT, badgeText: 'AGED',
      shortDescription: 'Instagram cũ 2+ năm xác minh SĐT',
      description: 'Instagram aged accounts trên 2 năm, PVA, có avatar và bài đăng.',
      images: ['https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop'], stock: 1800, sold: 4200, completedOrders: 19800, reviewCount: 178, ratingAvg: new Decimal(4.2), complaintPercent: new Decimal(1.5),
      features: ['Instagram 2+ năm', 'PVA verified', 'Có avatar & posts'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(35000), stock: 1800 }, { label: '5 tài khoản', price: new Decimal(160000), stock: 360 }],
      shopKey: 'accountpro',
    },
    {
      slug: 'netflix-premium-4k', name: 'Netflix Premium 4K - 1 Tháng',
      subType: ProductSubType.STREAMING_ACCOUNT, badgeText: '4K',
      shortDescription: 'Netflix Premium 4K UHD xem phim',
      description: 'Netflix Premium 4K UHD 1 tháng, 4 màn hình đồng thời, chất lượng cao nhất.',
      images: ['https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop'], stock: 890, sold: 3400, completedOrders: 16800, reviewCount: 312, ratingAvg: new Decimal(4.1), complaintPercent: new Decimal(2.0),
      features: ['Netflix Premium 4K UHD', '4 màn hình đồng thời', 'Download offline'],
      priceOptions: [{ label: '1 tháng', price: new Decimal(45000), stock: 890 }, { label: '3 tháng', price: new Decimal(120000), stock: 296 }, { label: '6 tháng', price: new Decimal(220000), stock: 148 }],
      shopKey: 'streamkeys',
    },
    {
      slug: 'youtube-premium-1month', name: 'YouTube Premium - 1 Tháng',
      subType: ProductSubType.STREAMING_ACCOUNT, badgeText: 'PREMIUM',
      shortDescription: 'YouTube Premium không quảng cáo, offline',
      description: 'YouTube Premium 1 tháng, xem không quảng cáo, tải offline, YouTube Music.',
      images: ['https://images.unsplash.com/photo-1611162618479-ee4d5b1e53c4?w=400&h=300&fit=crop'], stock: 720, sold: 2800, completedOrders: 13400, reviewCount: 256, ratingAvg: new Decimal(4.4), complaintPercent: new Decimal(0.8),
      features: ['YouTube Premium 1 tháng', 'Không quảng cáo', 'YouTube Music included'],
      priceOptions: [{ label: '1 tháng', price: new Decimal(35000), stock: 720 }, { label: '3 tháng', price: new Decimal(98000), stock: 240 }],
      shopKey: 'streamkeys',
    },
    {
      slug: 'disney-plus-1year', name: 'Disney+ - 1 Năm',
      subType: ProductSubType.STREAMING_ACCOUNT, badgeText: 'DISNEY',
      shortDescription: 'Disney+ xem phim Marvel, Star Wars',
      description: 'Disney+ subscription 1 năm, xem phim Marvel, Star Wars, Pixar không giới hạn.',
      images: ['https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop'], stock: 340, sold: 890, completedOrders: 4100, reviewCount: 98, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.5),
      features: ['Disney+ 1 năm', 'Marvel, Star Wars, Pixar', '4 thiết bị đồng thời'],
      priceOptions: [{ label: '1 năm', price: new Decimal(180000), stock: 340 }],
      shopKey: 'streamkeys',
    },
    {
      slug: 'pubg-mobile-account-level50', name: 'PUBG Mobile Account Level 50+ - Có Skin Xịn',
      subType: ProductSubType.GAMING_ACCOUNT, badgeText: 'GAME',
      shortDescription: 'PUBG Mobile level 50+ nhiều skin',
      description: 'Tài khoản PUBG Mobile level 50+, có nhiều skin hiếm, rank Platinum+.',
      images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'], stock: 280, sold: 680, completedOrders: 3100, reviewCount: 87, ratingAvg: new Decimal(4.3), complaintPercent: new Decimal(1.8),
      features: ['PUBG Mobile Level 50+', 'Nhiều skin hiếm', 'Rank Platinum+'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(120000), stock: 280 }, { label: 'Skin cao cấp', price: new Decimal(350000), stock: 56 }],
      shopKey: 'gameshop88',
    },
    {
      slug: 'valorant-account-gold', name: 'Valorant Account Gold - Rank Cao',
      subType: ProductSubType.GAMING_ACCOUNT, badgeText: 'GOLD',
      shortDescription: 'Valorant Gold rank nhiều agent',
      description: 'Tài khoản Valorant Gold rank, đầy đủ agent, nhiều skin vũ khí.',
      images: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop'], stock: 190, sold: 420, completedOrders: 1980, reviewCount: 54, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(1.0),
      features: ['Valorant Gold rank', 'Đầy đủ agent', 'Nhiều skin vũ khí'],
      priceOptions: [{ label: '1 tài khoản Gold', price: new Decimal(200000), stock: 190 }, { label: '1 tài khoản Platinum', price: new Decimal(450000), stock: 38 }],
      shopKey: 'gameshop88',
    },
    {
      slug: 'steam-account-premium', name: 'Steam Account Premium - Nhiều Game',
      subType: ProductSubType.GAMING_ACCOUNT, badgeText: 'STEAM',
      shortDescription: 'Steam account có nhiều game bản quyền',
      description: 'Steam account với nhiều game bản quyền, level 20+, CS:GO, GTA5, v.v.',
      images: ['https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop'], stock: 145, sold: 310, completedOrders: 1450, reviewCount: 38, ratingAvg: new Decimal(4.2), complaintPercent: new Decimal(2.0),
      features: ['Steam Level 20+', 'CS:GO, GTA5, v.v.', 'Nhiều game bản quyền'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(350000), stock: 145 }],
      shopKey: 'gameshop88',
    },
    {
      slug: 'linkedin-premium-1month', name: 'LinkedIn Premium - 1 Tháng',
      subType: ProductSubType.SOCIAL_ACCOUNT, badgeText: 'PRO',
      shortDescription: 'LinkedIn Premium Career/Business',
      description: 'LinkedIn Premium 1 tháng, InMail credits, xem ai xem profile của bạn.',
      images: ['https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=400&h=300&fit=crop'], stock: 160, sold: 380, completedOrders: 1800, reviewCount: 42, ratingAvg: new Decimal(4.4), complaintPercent: new Decimal(0.5),
      features: ['LinkedIn Premium 1 tháng', '15 InMail credits', 'Xem đầy đủ ai xem profile'],
      priceOptions: [{ label: '1 tháng Career', price: new Decimal(250000), stock: 160 }, { label: '1 tháng Business', price: new Decimal(380000), stock: 32 }],
      shopKey: 'accountpro',
    },
    {
      slug: 'twitter-account-aged-verified', name: 'Twitter/X Account Aged - Tài Khoản Cũ',
      subType: ProductSubType.SOCIAL_ACCOUNT, badgeText: null,
      shortDescription: 'Twitter account cũ 2+ năm có followers',
      description: 'Twitter/X account cũ hơn 2 năm, có 100+ followers thật.',
      images: ['https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop'], stock: 540, sold: 1200, completedOrders: 5600, reviewCount: 78, ratingAvg: new Decimal(4.0), complaintPercent: new Decimal(1.8),
      features: ['Twitter/X aged 2+ năm', '100+ followers thật', 'PVA verified'],
      priceOptions: [{ label: '1 tài khoản', price: new Decimal(55000), stock: 540 }, { label: '5 tài khoản', price: new Decimal(250000), stock: 108 }],
      shopKey: 'accountpro',
    },
    {
      slug: 'account-other-bundle', name: 'Bundle Tài Khoản Khác - Mix Social',
      subType: ProductSubType.OTHER_ACCOUNT, badgeText: 'BUNDLE',
      shortDescription: 'Gói mix nhiều tài khoản mạng xã hội',
      description: 'Bundle nhiều tài khoản: Pinterest, Reddit, Quora, v.v.',
      images: ['https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop'], stock: 320, sold: 680, completedOrders: 3100, reviewCount: 45, ratingAvg: new Decimal(3.9), complaintPercent: new Decimal(2.5),
      features: ['Mix nhiều loại tài khoản', 'Pinterest, Reddit, Quora', 'Giá gói tiết kiệm'],
      priceOptions: [{ label: '5 tài khoản mix', price: new Decimal(35000), stock: 320 }, { label: '20 tài khoản mix', price: new Decimal(120000), stock: 80 }],
      shopKey: 'accountpro',
    },
  ];

  for (const p of accountProducts) {
    await upsertProduct({ ...p, shopId: shops[p.shopKey], kind: ListingKind.PRODUCT, category: ListingCategory.ACCOUNT, type: ProductType.ACCOUNT, price: Number(p.priceOptions[0].price) });
  }

  // ─── PRODUCT OTHER ────────────────────────────────────────────────────────────
  const otherProducts = [
    {
      slug: 'proxy-residential-1gb', name: 'Proxy Residential - 1GB Băng Thông',
      subType: ProductSubType.GENERAL_OTHER, badgeText: 'PROXY',
      shortDescription: 'Proxy dân cư 1GB băng thông',
      description: 'Proxy residential chất lượng cao, 1GB băng thông, 100+ quốc gia, rotating IP.',
      images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop'], stock: 980, sold: 2400, completedOrders: 11200, reviewCount: 134, ratingAvg: new Decimal(4.4), complaintPercent: new Decimal(0.8),
      features: ['Proxy Residential 1GB', '100+ quốc gia', 'Rotating IP', 'HTTP/SOCKS5'],
      priceOptions: [{ label: '1GB', price: new Decimal(50000), stock: 980 }, { label: '5GB', price: new Decimal(220000), stock: 196 }, { label: '10GB', price: new Decimal(400000), stock: 98 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'sms-virtual-number-usa', name: 'Số Điện Thoại Ảo USA - Nhận SMS',
      subType: ProductSubType.GENERAL_OTHER, badgeText: 'SMS',
      shortDescription: 'Số điện thoại ảo USA nhận SMS OTP',
      description: 'Số điện thoại ảo USA để nhận SMS OTP, xác minh tài khoản.',
      images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'], stock: 2400, sold: 5800, completedOrders: 28000, reviewCount: 345, ratingAvg: new Decimal(4.2), complaintPercent: new Decimal(1.5),
      features: ['Số ảo USA thật', 'Nhận SMS OTP', 'Hỗ trợ 200+ dịch vụ'],
      priceOptions: [{ label: '1 lần nhận SMS', price: new Decimal(5000), stock: 2400 }, { label: '10 lần', price: new Decimal(40000), stock: 240 }],
      shopKey: 'techstore99',
    },
    {
      slug: 'cookie-facebook-fresh', name: 'Cookie Facebook Fresh - Clone Nhanh',
      subType: ProductSubType.GENERAL_OTHER, badgeText: 'HOT',
      shortDescription: 'Cookie Facebook fresh để clone tài khoản',
      description: 'Cookie Facebook mới nhất, fresh 100%, dùng để clone/import tài khoản.',
      images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop'], stock: 5600, sold: 14200, completedOrders: 68000, reviewCount: 456, ratingAvg: new Decimal(3.8), complaintPercent: new Decimal(3.0),
      features: ['Cookie Facebook fresh', 'Fresh 100%', 'Clone ngay lập tức'],
      priceOptions: [{ label: '1 cookie', price: new Decimal(8000), stock: 5600 }, { label: '10 cookie', price: new Decimal(70000), stock: 560 }, { label: '50 cookie', price: new Decimal(300000), stock: 112 }],
      shopKey: 'accountpro',
    },
    {
      slug: 'aws-account-free-tier', name: 'AWS Account - Free Tier $300 Credit',
      subType: ProductSubType.GENERAL_OTHER, badgeText: '$300',
      shortDescription: 'AWS account mới với $300 credit',
      description: 'Amazon AWS account mới với $300 free credit, full quyền truy cập.',
      images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop'], stock: 340, sold: 780, completedOrders: 3600, reviewCount: 98, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(1.0),
      features: ['AWS Account mới', '$300 free credit', 'Full access tất cả dịch vụ'],
      priceOptions: [{ label: '1 account', price: new Decimal(120000), stock: 340 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'gpt4-api-key', name: 'OpenAI API Key - GPT-4 Credits $10',
      subType: ProductSubType.GENERAL_OTHER, badgeText: 'API',
      shortDescription: 'OpenAI API key với $10 credits',
      description: 'OpenAI API key hợp lệ với $10 credits sẵn sàng sử dụng, truy cập GPT-4.',
      images: ['https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=300&fit=crop'], stock: 280, sold: 620, completedOrders: 2900, reviewCount: 76, ratingAvg: new Decimal(4.3), complaintPercent: new Decimal(1.5),
      features: ['OpenAI API key hợp lệ', '$10 credits', 'Truy cập GPT-4 & DALL-E'],
      priceOptions: [{ label: '$10 credits', price: new Decimal(95000), stock: 280 }, { label: '$50 credits', price: new Decimal(450000), stock: 56 }],
      shopKey: 'devmaster',
    },
  ];

  for (const p of otherProducts) {
    await upsertProduct({ ...p, shopId: shops[p.shopKey], kind: ListingKind.PRODUCT, category: ListingCategory.PRODUCT_OTHER, type: ProductType.OTHER, price: Number(p.priceOptions[0].price) });
  }

  // ─── SERVICE - ENGAGEMENT ────────────────────────────────────────────────────
  const engagementServices = [
    {
      slug: 'fb-like-post-1000', name: 'Like Bài Viết Facebook - 1000 Like Thật',
      subType: ProductSubType.FACEBOOK_ENGAGEMENT, badgeText: 'REAL',
      shortDescription: '1000 like Facebook từ tài khoản thật',
      description: 'Tăng 1000 like bài viết Facebook từ tài khoản thật Việt Nam, không drop.',
      images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop'], stock: 9999, sold: 24500, completedOrders: 118000, reviewCount: 678, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.5),
      features: ['1000 like Facebook thật', 'Tài khoản Việt Nam', 'Không drop 30 ngày', 'Tốc độ nhanh'],
      priceOptions: [{ label: '1000 like', price: new Decimal(15000), stock: 9999 }, { label: '5000 like', price: new Decimal(65000), stock: 1999 }, { label: '10000 like', price: new Decimal(120000), stock: 999 }],
      shopKey: 'socialboom',
    },
    {
      slug: 'fb-follow-page-1000', name: 'Follow/Like Page Facebook - 1000',
      subType: ProductSubType.FACEBOOK_ENGAGEMENT, badgeText: 'PAGE',
      shortDescription: '1000 follower page Facebook thật',
      description: 'Tăng 1000 follower và like page Facebook từ tài khoản thật.',
      images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'], stock: 9999, sold: 18900, completedOrders: 89000, reviewCount: 534, ratingAvg: new Decimal(4.4), complaintPercent: new Decimal(0.8),
      features: ['1000 follower page thật', 'Tài khoản Việt Nam', 'Tăng uy tín page'],
      priceOptions: [{ label: '1000 follow', price: new Decimal(20000), stock: 9999 }, { label: '5000 follow', price: new Decimal(90000), stock: 1999 }],
      shopKey: 'socialboom',
    },
    {
      slug: 'fb-share-post-500', name: 'Share Bài Facebook - 500 Share',
      subType: ProductSubType.FACEBOOK_ENGAGEMENT, badgeText: null,
      shortDescription: '500 share bài viết Facebook',
      description: 'Tăng 500 share bài viết Facebook, giúp viral content.',
      images: ['https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop'], stock: 9999, sold: 8900, completedOrders: 42000, reviewCount: 234, ratingAvg: new Decimal(4.2), complaintPercent: new Decimal(1.0),
      features: ['500 share Facebook', 'Giúp viral content', 'Tài khoản thật'],
      priceOptions: [{ label: '500 share', price: new Decimal(25000), stock: 9999 }, { label: '2000 share', price: new Decimal(90000), stock: 1999 }],
      shopKey: 'socialboom',
    },
    {
      slug: 'ig-follower-1000-real', name: 'Follower Instagram - 1000 Thật',
      subType: ProductSubType.INSTAGRAM_ENGAGEMENT, badgeText: 'REAL',
      shortDescription: '1000 follower Instagram thật không drop',
      description: 'Tăng 1000 follower Instagram từ tài khoản thật, không drop, bảo hành 30 ngày.',
      images: ['https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop'], stock: 9999, sold: 21300, completedOrders: 98000, reviewCount: 456, ratingAvg: new Decimal(4.6), complaintPercent: new Decimal(0.4),
      features: ['1000 follower Instagram thật', 'Không drop 30 ngày', 'Tốc độ tự nhiên'],
      priceOptions: [{ label: '1000 follower', price: new Decimal(18000), stock: 9999 }, { label: '5000 follower', price: new Decimal(80000), stock: 1999 }, { label: '10000 follower', price: new Decimal(150000), stock: 999 }],
      shopKey: 'socialboom',
    },
    {
      slug: 'ig-like-post-500', name: 'Like Post Instagram - 500 Like',
      subType: ProductSubType.INSTAGRAM_ENGAGEMENT, badgeText: null,
      shortDescription: '500 like Instagram từ tài khoản thật',
      description: 'Tăng 500 like bài viết Instagram từ tài khoản thật.',
      images: ['https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&h=300&fit=crop'], stock: 9999, sold: 13400, completedOrders: 62000, reviewCount: 312, ratingAvg: new Decimal(4.3), complaintPercent: new Decimal(0.8),
      features: ['500 like Instagram thật', 'Tài khoản real', 'Tốc độ nhanh'],
      priceOptions: [{ label: '500 like', price: new Decimal(8000), stock: 9999 }, { label: '2000 like', price: new Decimal(28000), stock: 1999 }],
      shopKey: 'socialboom',
    },
    {
      slug: 'tiktok-follower-1000', name: 'Follower TikTok - 1000 Thật',
      subType: ProductSubType.TIKTOK_ENGAGEMENT, badgeText: 'HOT',
      shortDescription: '1000 follower TikTok thật',
      description: 'Tăng 1000 follower TikTok thật, giúp đạt 1000 follower để live.',
      images: ['https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=300&fit=crop'], stock: 9999, sold: 34200, completedOrders: 156000, reviewCount: 789, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.6),
      features: ['1000 follower TikTok thật', 'Giúp đạt điều kiện live', 'Tốc độ tự nhiên'],
      priceOptions: [{ label: '1000 follower', price: new Decimal(12000), stock: 9999 }, { label: '5000 follower', price: new Decimal(55000), stock: 1999 }, { label: '10000 follower', price: new Decimal(100000), stock: 999 }],
      shopKey: 'socialboom',
    },
    {
      slug: 'tiktok-view-10000', name: 'View Video TikTok - 10000 View',
      subType: ProductSubType.TIKTOK_ENGAGEMENT, badgeText: null,
      shortDescription: '10000 view video TikTok',
      description: 'Tăng 10000 view video TikTok, giúp video lên xu hướng.',
      images: ['https://images.unsplash.com/photo-1598128558393-70ff21433be0?w=400&h=300&fit=crop'], stock: 9999, sold: 28900, completedOrders: 134000, reviewCount: 567, ratingAvg: new Decimal(4.3), complaintPercent: new Decimal(0.8),
      features: ['10000 view TikTok', 'Giúp lên xu hướng', 'Tốc độ nhanh'],
      priceOptions: [{ label: '10000 view', price: new Decimal(5000), stock: 9999 }, { label: '100000 view', price: new Decimal(40000), stock: 1999 }],
      shopKey: 'socialboom',
    },
    {
      slug: 'youtube-subscriber-1000', name: 'Subscribe YouTube - 1000 Thật',
      subType: ProductSubType.YOUTUBE_ENGAGEMENT, badgeText: 'REAL',
      shortDescription: '1000 subscriber YouTube thật',
      description: 'Tăng 1000 subscriber YouTube thật, giúp đạt điều kiện monetize.',
      images: ['https://images.unsplash.com/photo-1611162618479-ee4d5b1e53c4?w=400&h=300&fit=crop'], stock: 9999, sold: 16700, completedOrders: 78000, reviewCount: 423, ratingAvg: new Decimal(4.4), complaintPercent: new Decimal(0.9),
      features: ['1000 subscriber YouTube thật', 'Hỗ trợ đạt 1000 sub', 'Không drop 30 ngày'],
      priceOptions: [{ label: '1000 sub', price: new Decimal(45000), stock: 9999 }, { label: '5000 sub', price: new Decimal(200000), stock: 1999 }],
      shopKey: 'socialboom',
    },
    {
      slug: 'youtube-watchtime-4000h', name: 'Watch Time YouTube - 4000 Giờ',
      subType: ProductSubType.YOUTUBE_ENGAGEMENT, badgeText: 'MONETIZE',
      shortDescription: '4000 giờ xem YouTube để monetize',
      description: 'Tăng 4000 giờ xem YouTube thật, đạt điều kiện bật monetize.',
      images: ['https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop'], stock: 5000, sold: 8900, completedOrders: 42000, reviewCount: 234, ratingAvg: new Decimal(4.2), complaintPercent: new Decimal(1.5),
      features: ['4000 giờ xem thật', 'Đạt điều kiện monetize', 'Hoàn tiền nếu không đạt'],
      priceOptions: [{ label: '4000 giờ', price: new Decimal(280000), stock: 5000 }],
      shopKey: 'socialboom',
    },
    {
      slug: 'google-review-5star', name: 'Review Google Maps - 5 Sao',
      subType: ProductSubType.OTHER_ENGAGEMENT, badgeText: '5★',
      shortDescription: 'Đánh giá 5 sao Google Maps thật',
      description: 'Tăng đánh giá 5 sao trên Google Maps từ tài khoản thật, kèm comment.',
      images: ['https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=300&fit=crop'], stock: 9999, sold: 12400, completedOrders: 57000, reviewCount: 389, ratingAvg: new Decimal(4.6), complaintPercent: new Decimal(0.5),
      features: ['Review 5 sao Google Maps', 'Tài khoản thật', 'Kèm comment đa dạng', 'Không xóa'],
      priceOptions: [{ label: '10 review', price: new Decimal(150000), stock: 9999 }, { label: '50 review', price: new Decimal(650000), stock: 1999 }],
      shopKey: 'socialboom',
    },
  ];

  for (const p of engagementServices) {
    await upsertProduct({ ...p, shopId: shops[p.shopKey], kind: ListingKind.SERVICE, category: ListingCategory.ENGAGEMENT, type: ProductType.SERVICE, price: Number(p.priceOptions[0].price) });
  }

  // ─── SERVICE - BLOCKCHAIN ────────────────────────────────────────────────────
  const blockchainServices = [
    {
      slug: 'smart-contract-erc20', name: 'Viết Smart Contract ERC-20 Token',
      subType: ProductSubType.SMART_CONTRACT, badgeText: 'ERC-20',
      shortDescription: 'Tạo token ERC-20 trên Ethereum',
      description: 'Dịch vụ viết và deploy smart contract ERC-20 token chuẩn trên Ethereum, audit sơ bộ.',
      images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop'], stock: 9999, sold: 890, completedOrders: 4200, reviewCount: 67, ratingAvg: new Decimal(4.7), complaintPercent: new Decimal(0.3),
      features: ['Smart contract ERC-20', 'Deploy trên Ethereum/BSC', 'Audit sơ bộ', 'Hỗ trợ sau triển khai'],
      priceOptions: [{ label: 'Token cơ bản', price: new Decimal(2000000), stock: 9999 }, { label: 'Token nâng cao + LP', price: new Decimal(5000000), stock: 9999 }],
      shopKey: 'blockchainvn',
    },
    {
      slug: 'nft-collection-create', name: 'Tạo NFT Collection - 1000 NFTs',
      subType: ProductSubType.NFT_SERVICE, badgeText: 'NFT',
      shortDescription: 'Tạo và deploy collection 1000 NFTs',
      description: 'Dịch vụ tạo và deploy NFT collection 1000 items lên Ethereum/Polygon, bao gồm metadata.',
      images: ['https://images.unsplash.com/photo-1646617747609-45b466ace9a6?w=400&h=300&fit=crop'], stock: 9999, sold: 234, completedOrders: 1100, reviewCount: 28, ratingAvg: new Decimal(4.6), complaintPercent: new Decimal(0.5),
      features: ['1000 NFT generation', 'Deploy Ethereum/Polygon', 'Metadata IPFS', 'Smart contract ERC-721'],
      priceOptions: [{ label: '1000 NFTs', price: new Decimal(5000000), stock: 9999 }, { label: '5000 NFTs', price: new Decimal(12000000), stock: 9999 }],
      shopKey: 'blockchainvn',
    },
    {
      slug: 'defi-dapp-development', name: 'Phát Triển DApp DeFi - Swap/Staking',
      subType: ProductSubType.BLOCKCHAIN_DEV, badgeText: 'DeFi',
      shortDescription: 'Phát triển ứng dụng DeFi swap hoặc staking',
      description: 'Phát triển DApp DeFi cơ bản (swap/staking) trên Ethereum/BSC với UI đẹp.',
      images: ['https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop'], stock: 9999, sold: 89, completedOrders: 420, reviewCount: 15, ratingAvg: new Decimal(4.8), complaintPercent: new Decimal(0.2),
      features: ['DApp DeFi swap/staking', 'UI/UX đẹp', 'Smart contract audit', 'Hỗ trợ 3 tháng'],
      priceOptions: [{ label: 'Swap cơ bản', price: new Decimal(15000000), stock: 9999 }, { label: 'Staking + Swap', price: new Decimal(30000000), stock: 9999 }],
      shopKey: 'blockchainvn',
    },
    {
      slug: 'crypto-bot-trading', name: 'Bot Giao Dịch Crypto Tự Động',
      subType: ProductSubType.BLOCKCHAIN_DEV, badgeText: 'BOT',
      shortDescription: 'Bot trading crypto tự động theo chiến lược',
      description: 'Phát triển bot giao dịch crypto tự động trên Binance/Bybit theo chiến lược của bạn.',
      images: ['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop'], stock: 9999, sold: 145, completedOrders: 680, reviewCount: 34, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(1.0),
      features: ['Bot trading tự động', 'Binance/Bybit API', 'Chiến lược tùy chỉnh', 'Dashboard theo dõi'],
      priceOptions: [{ label: 'Bot cơ bản', price: new Decimal(8000000), stock: 9999 }, { label: 'Bot nâng cao', price: new Decimal(20000000), stock: 9999 }],
      shopKey: 'blockchainvn',
    },
    {
      slug: 'blockchain-other-audit', name: 'Audit Smart Contract - Kiểm Tra Bảo Mật',
      subType: ProductSubType.OTHER_BLOCKCHAIN, badgeText: 'AUDIT',
      shortDescription: 'Audit và kiểm tra bảo mật smart contract',
      description: 'Dịch vụ audit smart contract chuyên sâu, báo cáo chi tiết lỗ hổng bảo mật.',
      images: ['https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'], stock: 9999, sold: 67, completedOrders: 320, reviewCount: 18, ratingAvg: new Decimal(4.9), complaintPercent: new Decimal(0.0),
      features: ['Audit smart contract', 'Báo cáo chi tiết', 'Fix lỗ hổng', 'Certificate bảo mật'],
      priceOptions: [{ label: 'Audit < 500 dòng', price: new Decimal(5000000), stock: 9999 }, { label: 'Audit > 500 dòng', price: new Decimal(12000000), stock: 9999 }],
      shopKey: 'blockchainvn',
    },
  ];

  for (const p of blockchainServices) {
    await upsertProduct({ ...p, shopId: shops[p.shopKey], kind: ListingKind.SERVICE, category: ListingCategory.BLOCKCHAIN, type: ProductType.SERVICE, price: Number(p.priceOptions[0].price) });
  }

  // ─── SERVICE - SOFTWARE DEV ───────────────────────────────────────────────────
  const softwareServices = [
    {
      slug: 'website-landing-page', name: 'Thiết Kế Landing Page - Chuyển Đổi Cao',
      subType: ProductSubType.CUSTOM_SOFTWARE_DEV, badgeText: 'WEB',
      shortDescription: 'Landing page đẹp tối ưu chuyển đổi',
      description: 'Thiết kế và phát triển landing page đẹp, tối ưu tỉ lệ chuyển đổi, responsive.',
      images: ['https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop'], stock: 9999, sold: 456, completedOrders: 2100, reviewCount: 89, ratingAvg: new Decimal(4.8), complaintPercent: new Decimal(0.3),
      features: ['Landing page responsive', 'Tối ưu conversion rate', 'Tích hợp form & analytics', 'Bàn giao source code'],
      priceOptions: [{ label: 'Landing page cơ bản', price: new Decimal(3000000), stock: 9999 }, { label: 'Landing page nâng cao', price: new Decimal(7000000), stock: 9999 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'ecommerce-website-shopify', name: 'Website Bán Hàng Shopify - Setup Hoàn Chỉnh',
      subType: ProductSubType.CUSTOM_SOFTWARE_DEV, badgeText: 'SHOPIFY',
      shortDescription: 'Setup cửa hàng Shopify hoàn chỉnh',
      description: 'Thiết kế và setup cửa hàng Shopify hoàn chỉnh, tích hợp thanh toán, vận chuyển.',
      images: ['https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop'], stock: 9999, sold: 234, completedOrders: 1100, reviewCount: 56, ratingAvg: new Decimal(4.7), complaintPercent: new Decimal(0.5),
      features: ['Shopify setup hoàn chỉnh', 'Theme tùy chỉnh', 'Tích hợp thanh toán VN', 'Training sử dụng'],
      priceOptions: [{ label: 'Setup cơ bản', price: new Decimal(5000000), stock: 9999 }, { label: 'Setup đầy đủ', price: new Decimal(12000000), stock: 9999 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'api-integration-service', name: 'Tích Hợp API - Kết Nối Hệ Thống',
      subType: ProductSubType.API_INTEGRATION, badgeText: 'API',
      shortDescription: 'Tích hợp API bên thứ 3 vào hệ thống',
      description: 'Dịch vụ tích hợp API bên thứ 3: thanh toán, vận chuyển, SMS, v.v. vào hệ thống.',
      images: ['https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=300&fit=crop'], stock: 9999, sold: 189, completedOrders: 890, reviewCount: 45, ratingAvg: new Decimal(4.6), complaintPercent: new Decimal(0.4),
      features: ['Tích hợp API bên thứ 3', 'Thanh toán, SMS, vận chuyển', 'Test & documentation', 'Hỗ trợ 1 tháng'],
      priceOptions: [{ label: 'Tích hợp 1 API', price: new Decimal(2000000), stock: 9999 }, { label: 'Tích hợp 3+ API', price: new Decimal(5000000), stock: 9999 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'mobile-app-react-native', name: 'App Mobile React Native - iOS & Android',
      subType: ProductSubType.CUSTOM_SOFTWARE_DEV, badgeText: 'MOBILE',
      shortDescription: 'Phát triển app mobile React Native',
      description: 'Phát triển ứng dụng mobile React Native chạy cả iOS & Android từ 1 codebase.',
      images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'], stock: 9999, sold: 78, completedOrders: 370, reviewCount: 22, ratingAvg: new Decimal(4.9), complaintPercent: new Decimal(0.2),
      features: ['React Native iOS & Android', 'UI/UX thiết kế đẹp', 'Push notification', 'Backend API included'],
      priceOptions: [{ label: 'App cơ bản 10 màn hình', price: new Decimal(20000000), stock: 9999 }, { label: 'App đầy đủ', price: new Decimal(50000000), stock: 9999 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'seo-service-onpage', name: 'SEO Onpage - Tối Ưu Website Lên Top',
      subType: ProductSubType.OTHER_SERVICE_SOFTWARE, badgeText: 'SEO',
      shortDescription: 'SEO onpage tối ưu website lên Google',
      description: 'Dịch vụ SEO onpage toàn diện: audit, tối ưu meta, tốc độ, schema, nội dung.',
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'], stock: 9999, sold: 345, completedOrders: 1600, reviewCount: 112, ratingAvg: new Decimal(4.5), complaintPercent: new Decimal(0.8),
      features: ['Audit website toàn diện', 'Tối ưu meta & schema', 'Cải thiện tốc độ tải', 'Báo cáo hàng tháng'],
      priceOptions: [{ label: '1 tháng SEO', price: new Decimal(3000000), stock: 9999 }, { label: '3 tháng SEO', price: new Decimal(8000000), stock: 9999 }],
      shopKey: 'devmaster',
    },
  ];

  for (const p of softwareServices) {
    await upsertProduct({ ...p, shopId: shops[p.shopKey], kind: ListingKind.SERVICE, category: ListingCategory.SERVICE_SOFTWARE, type: ProductType.SERVICE, price: Number(p.priceOptions[0].price) });
  }

  // ─── SERVICE - OTHER ──────────────────────────────────────────────────────────
  const otherServices = [
    {
      slug: 'data-entry-service', name: 'Nhập Liệu Data Entry - Giá Rẻ Nhanh',
      subType: ProductSubType.GENERAL_OTHER, badgeText: null,
      shortDescription: 'Nhập liệu nhanh chóng, chính xác',
      description: 'Dịch vụ nhập liệu data entry chuyên nghiệp, nhanh, chính xác, bảo mật.',
      images: ['https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop'], stock: 9999, sold: 567, completedOrders: 2600, reviewCount: 134, ratingAvg: new Decimal(4.3), complaintPercent: new Decimal(1.2),
      features: ['Nhập liệu chính xác 99%+', 'Bảo mật thông tin', 'Nhanh chóng', 'Nhiều định dạng'],
      priceOptions: [{ label: '1000 dòng', price: new Decimal(200000), stock: 9999 }, { label: '5000 dòng', price: new Decimal(800000), stock: 9999 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'virtual-assistant-service', name: 'Trợ Lý Ảo - Virtual Assistant',
      subType: ProductSubType.GENERAL_OTHER, badgeText: 'VA',
      shortDescription: 'Trợ lý ảo xử lý công việc hàng ngày',
      description: 'Dịch vụ trợ lý ảo: email, lịch hẹn, nghiên cứu, nhập liệu, v.v.',
      images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'], stock: 9999, sold: 234, completedOrders: 1100, reviewCount: 67, ratingAvg: new Decimal(4.6), complaintPercent: new Decimal(0.5),
      features: ['Trợ lý ảo 8h/ngày', 'Email & lịch hẹn', 'Nghiên cứu thị trường', 'Nhập liệu & báo cáo'],
      priceOptions: [{ label: '1 tuần', price: new Decimal(800000), stock: 9999 }, { label: '1 tháng', price: new Decimal(2500000), stock: 9999 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'content-writing-vn', name: 'Viết Nội Dung Chuẩn SEO - Tiếng Việt',
      subType: ProductSubType.GENERAL_OTHER, badgeText: 'CONTENT',
      shortDescription: 'Viết content chuẩn SEO chất lượng cao',
      description: 'Dịch vụ viết nội dung website chuẩn SEO, unique 100%, tiếng Việt chuyên nghiệp.',
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'], stock: 9999, sold: 789, completedOrders: 3700, reviewCount: 189, ratingAvg: new Decimal(4.4), complaintPercent: new Decimal(0.8),
      features: ['Content chuẩn SEO', 'Unique 100%', 'Tiếng Việt chuẩn', 'Keyword tối ưu'],
      priceOptions: [{ label: '1 bài 1000 chữ', price: new Decimal(150000), stock: 9999 }, { label: '10 bài', price: new Decimal(1200000), stock: 9999 }],
      shopKey: 'devmaster',
    },
    {
      slug: 'graphic-design-logo', name: 'Thiết Kế Logo - Chuyên Nghiệp',
      subType: ProductSubType.GENERAL_OTHER, badgeText: 'DESIGN',
      shortDescription: 'Thiết kế logo chuyên nghiệp đẹp',
      description: 'Dịch vụ thiết kế logo chuyên nghiệp, bàn giao file vector, nhiều phiên bản.',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop'], stock: 9999, sold: 456, completedOrders: 2100, reviewCount: 123, ratingAvg: new Decimal(4.7), complaintPercent: new Decimal(0.4),
      features: ['Logo chuyên nghiệp', 'File vector AI/EPS/PNG', '3 phiên bản màu', 'Revisions không giới hạn'],
      priceOptions: [{ label: 'Logo cơ bản', price: new Decimal(500000), stock: 9999 }, { label: 'Logo cao cấp', price: new Decimal(1500000), stock: 9999 }],
      shopKey: 'devmaster',
    },
  ];

  for (const p of otherServices) {
    await upsertProduct({ ...p, shopId: shops[p.shopKey], kind: ListingKind.SERVICE, category: ListingCategory.SERVICE_OTHER, type: ProductType.SERVICE, price: Number(p.priceOptions[0].price) });
  }

  console.log('\n🎉 Seed completed successfully!');
  const total = await prisma.product.count();
  console.log(`📦 Total products in DB: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
