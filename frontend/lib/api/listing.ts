// API service layer for product listing operations
// Provides centralized functions for all listing, detail, and favorite endpoints

import {
  ProductListResponse,
  ProductDetail,
  FavoriteToggleResponse,
} from '@/types/listing';

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Fetch product/service listings with filters, sort, and pagination
 * @param endpoint - API endpoint (e.g., "/products/email", "/services/blockchain")
 * @param params - Optional query parameters
 * @returns Promise<ProductListResponse>
 */
export async function getProductListing(
  endpoint: string,
  params?: {
    subTypes?: string;
    sort?: 'popular' | 'price_asc' | 'price_desc';
    page?: number;
    limit?: number;
  }
): Promise<ProductListResponse> {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.subTypes) queryParams.append('subTypes', params.subTypes);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ProductListResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch product listing');
  }
}

/**
 * Fetch single product detail by slug
 * @param slug - Product slug (e.g., "gmail-new-usa-reg-ios")
 * @returns Promise<ProductDetail>
 */
export async function getProductDetail(slug: string): Promise<ProductDetail> {
  try {
    const url = `${API_BASE_URL}/api/products/slug/${slug}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ProductDetail = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch product detail');
  }
}

/**
 * Toggle product favorite status (add/remove)
 * @param productId - Product ID from API
 * @param token - JWT auth token
 * @returns Promise<FavoriteToggleResponse>
 */
export async function toggleFavorite(
  productId: string,
  token: string
): Promise<FavoriteToggleResponse> {
  try {
    const url = `${API_BASE_URL}/api/products/${productId}/favorite`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: FavoriteToggleResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to toggle favorite');
  }
}

/**
 * Fetch user's favorited products with pagination
 * @param token - JWT auth token
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 12)
 * @returns Promise<ProductListResponse>
 */
export async function getUserFavorites(
  token: string,
  page: number = 1,
  limit: number = 12
): Promise<ProductListResponse> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/users/me/favorites?${queryString}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ProductListResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user favorites');
  }
}
