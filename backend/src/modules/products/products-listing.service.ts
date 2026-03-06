import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { ListingKind, ListingCategory, ProductSubType, Prisma } from '@prisma/client';
import { GetProductListDto, SortOption } from './dto/get-product-list.dto';
import { ProductListResponseDto, ProductCardDto, SubTypeCount } from './dto/product-list-response.dto';

// Mapping routes to kind + category
const ROUTE_MAPPING = {
  email: { kind: ListingKind.PRODUCT, category: ListingCategory.EMAIL },
  software: { kind: ListingKind.PRODUCT, category: ListingCategory.PRODUCT_SOFTWARE },
  account: { kind: ListingKind.PRODUCT, category: ListingCategory.ACCOUNT },
  other: { kind: ListingKind.PRODUCT, category: ListingCategory.PRODUCT_OTHER },
  engagement: { kind: ListingKind.SERVICE, category: ListingCategory.ENGAGEMENT },
  'service-software': { kind: ListingKind.SERVICE, category: ListingCategory.SERVICE_SOFTWARE },
  blockchain: { kind: ListingKind.SERVICE, category: ListingCategory.BLOCKCHAIN },
  'service-other': { kind: ListingKind.SERVICE, category: ListingCategory.SERVICE_OTHER },
};

// SubType labels for display
const SUBTYPE_LABELS: Record<string, string> = {
  GMAIL: 'Gmail',
  HOTMAIL: 'Hotmail',
  OUTLOOKMAIL: 'OutlookMail',
  IUUMAIL: 'IuuMail',
  DOMAINMAIL: 'DomainMail',
  YAHOOMAIL: 'YahooMail',
  PROTONMAIL: 'ProtonMail',
  OTHER_MAIL: 'Loại Mail Khác',
  WINDOWS_SOFTWARE: 'Windows Software',
  MAC_SOFTWARE: 'Mac Software',
  MOBILE_APP: 'Mobile App',
  WEB_APP: 'Web App',
  OTHER_SOFTWARE: 'Phần mềm khác',
  SOCIAL_ACCOUNT: 'Tài khoản mạng xã hội',
  GAMING_ACCOUNT: 'Tài khoản game',
  STREAMING_ACCOUNT: 'Tài khoản streaming',
  OTHER_ACCOUNT: 'Tài khoản khác',
  FACEBOOK_ENGAGEMENT: 'Facebook',
  INSTAGRAM_ENGAGEMENT: 'Instagram',
  TIKTOK_ENGAGEMENT: 'TikTok',
  YOUTUBE_ENGAGEMENT: 'YouTube',
  OTHER_ENGAGEMENT: 'Dịch vụ khác',
  BLOCKCHAIN_DEV: 'Blockchain Development',
  SMART_CONTRACT: 'Smart Contract',
  NFT_SERVICE: 'NFT Service',
  OTHER_BLOCKCHAIN: 'Blockchain khác',
  CUSTOM_SOFTWARE_DEV: 'Custom Software',
  API_INTEGRATION: 'API Integration',
  OTHER_SERVICE_SOFTWARE: 'Dịch vụ phần mềm khác',
  GENERAL_OTHER: 'Khác',
};

@Injectable()
export class ProductsListingService {
  constructor(private prisma: PrismaService) {}

  async getProductList(
    routeKey: string,
    query: GetProductListDto,
    userId?: string,
  ): Promise<ProductListResponseDto> {
    const mapping = ROUTE_MAPPING[routeKey];
    if (!mapping) {
      throw new Error(`Invalid route: ${routeKey}`);
    }

    const { kind, category } = mapping;
    const { subTypes, sort = SortOption.POPULAR, page = 1, limit = 12 } = query;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      kind,
      category,
    };

    // Filter by subTypes if provided
    if (subTypes) {
      const subTypeArray = subTypes.split(',').map(s => s.trim());
      where.subType = { in: subTypeArray as ProductSubType[] };
    }

    // Build orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    switch (sort) {
      case SortOption.POPULAR:
        orderBy = [{ completedOrders: 'desc' }, { sold: 'desc' }];
        break;
      case SortOption.PRICE_ASC:
        orderBy = [{ price: 'asc' }];
        break;
      case SortOption.PRICE_DESC:
        orderBy = [{ price: 'desc' }];
        break;
    }

    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [products, total, subTypeCounts] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          shop: { select: { name: true } },
          features: { orderBy: { sortOrder: 'asc' } },
          priceOptions: { where: { isActive: true } },
          favorites: userId ? { where: { userId } } : false,
        },
      }),
      this.prisma.product.count({ where }),
      this.getSubTypeCounts(kind, category),
    ]);

    // Map to response format
    const data: ProductCardDto[] = products.map(product => {
      const priceOptions = product.priceOptions || [];
      const prices = priceOptions.map(opt => Number(opt.price));
      const priceMin = prices.length > 0 ? Math.min(...prices) : Number(product.price);
      const priceMax = prices.length > 0 ? Math.max(...prices) : Number(product.price);

      return {
        id: product.id,
        slug: product.slug || product.id,
        title: product.name,
        image: product.images[0] || '',
        badgeText: product.badgeText,
        sellerName: product.shop.name,
        stock: product.stock,
        priceMin,
        priceMax,
        rating: product.ratingAvg ? Number(product.ratingAvg) : 0,
        reviewCount: product.reviewCount,
        completedOrders: product.completedOrders,
        complaintPercent: Number(product.complaintPercent),
        features: product.features.map(f => f.content),
        isFavorite: userId ? product.favorites.length > 0 : false,
      };
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        subTypeCounts,
      },
    };
  }

  private async getSubTypeCounts(
    kind: ListingKind,
    category: ListingCategory,
  ): Promise<SubTypeCount[]> {
    const counts = await this.prisma.product.groupBy({
      by: ['subType'],
      where: {
        isActive: true,
        kind,
        category,
        subType: { not: null },
      },
      _count: true,
    });

    return counts
      .filter(c => c.subType)
      .map(c => ({
        value: c.subType as string,
        label: SUBTYPE_LABELS[c.subType as string] || c.subType as string,
        count: c._count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  async getProductBySlug(slug: string, userId?: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            rating: true,
            totalSales: true,
          },
        },
        features: { orderBy: { sortOrder: 'asc' } },
        priceOptions: { where: { isActive: true } },
        favorites: userId ? { where: { userId } } : false,
      },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      ratingAvg: product.ratingAvg ? Number(product.ratingAvg) : 0,
      complaintPercent: Number(product.complaintPercent),
      priceOptions: product.priceOptions.map(opt => ({
        ...opt,
        price: Number(opt.price),
      })),
      isFavorite: userId ? product.favorites.length > 0 : false,
    };
  }

  async toggleFavorite(userId: string, productId: string) {
    const existing = await this.prisma.productFavorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await this.prisma.productFavorite.delete({
        where: { id: existing.id },
      });
      return { success: true, isFavorite: false };
    } else {
      await this.prisma.productFavorite.create({
        data: { userId, productId },
      });
      return { success: true, isFavorite: true };
    }
  }

  async getUserFavorites(userId: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.productFavorite.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          product: {
            include: {
              shop: { select: { name: true } },
              features: { orderBy: { sortOrder: 'asc' } },
              priceOptions: { where: { isActive: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.productFavorite.count({ where: { userId } }),
    ]);

    const data: ProductCardDto[] = favorites.map(fav => {
      const product = fav.product;
      const priceOptions = product.priceOptions || [];
      const prices = priceOptions.map(opt => Number(opt.price));
      const priceMin = prices.length > 0 ? Math.min(...prices) : Number(product.price);
      const priceMax = prices.length > 0 ? Math.max(...prices) : Number(product.price);

      return {
        id: product.id,
        slug: product.slug || product.id,
        title: product.name,
        image: product.images[0] || '',
        badgeText: product.badgeText,
        sellerName: product.shop.name,
        stock: product.stock,
        priceMin,
        priceMax,
        rating: product.ratingAvg ? Number(product.ratingAvg) : 0,
        reviewCount: product.reviewCount,
        completedOrders: product.completedOrders,
        complaintPercent: Number(product.complaintPercent),
        features: product.features.map(f => f.content),
        isFavorite: true,
      };
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
