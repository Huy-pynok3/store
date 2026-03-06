// TypeScript type definitions for Listing API responses
// Matches backend DTOs from backend/src/modules/products/dto/

/**
 * Product card data for listing pages
 * Source: backend ProductCardDto
 */
export interface ProductCard {
  id: string;
  slug: string;
  title: string;
  image: string;
  badgeText: string | null;
  sellerName: string;
  stock: number;
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  completedOrders: number;
  complaintPercent: number;
  features: string[];
  isFavorite: boolean;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Subtype count for filters
 */
export interface SubTypeCount {
  value: string;
  label: string;
  count: number;
}

/**
 * Product listing API response
 * Source: backend ProductListResponseDto
 */
export interface ProductListResponse {
  data: ProductCard[];
  meta: PaginationMeta;
  filters: {
    subTypeCounts: SubTypeCount[];
  };
}

/**
 * Shop information for product detail
 */
export interface Shop {
  id: string;
  name: string;
  rating: number;
  totalSales: number;
}

/**
 * Product feature for detail page
 */
export interface ProductFeature {
  id: string;
  content: string;
  sortOrder: number;
}

/**
 * Price option for product detail
 */
export interface PriceOption {
  id: string;
  label: string;
  price: number;
  stock: number;
  isActive: boolean;
}

/**
 * Product detail page data
 * Source: backend API_REFERENCE.md - GET /products/slug/:slug
 */
export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  badgeText: string | null;
  kind: string;
  category: string;
  subType: string;
  images: string[];
  stock: number;
  sold: number;
  ratingAvg: number;
  reviewCount: number;
  completedOrders: number;
  complaintPercent: number;
  isActive: boolean;
  autoDeliver: boolean;
  shop: Shop;
  features: ProductFeature[];
  priceOptions: PriceOption[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Favorite toggle API response
 * Source: backend API_REFERENCE.md - POST /products/:id/favorite
 */
export interface FavoriteToggleResponse {
  success: boolean;
  isFavorite: boolean;
}
