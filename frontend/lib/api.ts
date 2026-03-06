// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// API endpoints with /api prefix
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    GOOGLE: `${API_BASE_URL}/api/auth/google`,
    GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
  },
  // User endpoints
  USERS: {
    ME: `${API_BASE_URL}/api/users/me`,
  },
  CHAT: {
    CONVERSATIONS: `${API_BASE_URL}/api/chat/conversations`,
    conversationMessages: (conversationId: string) =>
      `${API_BASE_URL}/api/chat/conversations/${conversationId}/messages`,
    conversationRead: (conversationId: string) =>
      `${API_BASE_URL}/api/chat/conversations/${conversationId}/read`,
  },
  PRODUCTS: {
    warehouseConfig: (productId: string) =>
      `${API_BASE_URL}/api/products/${productId}/warehouse`,
    warehouseTest: (productId: string) =>
      `${API_BASE_URL}/api/products/${productId}/warehouse/test`,
    warehouseTestUrl: `${API_BASE_URL}/api/products/warehouse/test-url`,
    warehouseStock: (productId: string) =>
      `${API_BASE_URL}/api/products/${productId}/warehouse/stock`,
  },
  // Add more endpoints as needed
}

// Helper function to build API URL
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Add /api prefix if not present
  const pathWithApi = cleanPath.startsWith('api/') ? cleanPath : `api/${cleanPath}`
  
  return `${API_BASE_URL}/${pathWithApi}`
}

// Export base URL for direct use
export const API_URL = API_BASE_URL
