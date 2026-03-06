export interface ProductCardDto {
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

export interface SubTypeCount {
  value: string;
  label: string;
  count: number;
}

export interface ProductListResponseDto {
  data: ProductCardDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    subTypeCounts: SubTypeCount[];
  };
}
