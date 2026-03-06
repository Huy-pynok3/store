// Route-to-endpoint mapping utility
// Maps frontend Vietnamese routes to backend API endpoints

/**
 * Mapping of frontend routes to backend API endpoints
 * Maintains centralized mapping to avoid scattered if/else logic
 */
const ROUTE_TO_ENDPOINT_MAP: Record<string, string> = {
  // Product routes
  '/san-pham/email': '/products/email',
  '/san-pham/phan-mem': '/products/software',
  '/san-pham/tai-khoan': '/products/account',
  '/san-pham/khac': '/products/other',
  
  // Service routes
  '/dich-vu/tang-tuong-tac': '/services/engagement',
  '/dich-vu/phan-mem': '/services/software',
  '/dich-vu/blockchain': '/services/blockchain',
  '/dich-vu/khac': '/services/other',
};

/**
 * Get backend API endpoint from frontend route
 * @param route - Frontend route path (e.g., "/san-pham/email")
 * @returns Backend API endpoint (e.g., "/products/email")
 * @throws Error if route is not found in mapping
 */
export function getEndpointFromRoute(route: string): string {
  const endpoint = ROUTE_TO_ENDPOINT_MAP[route];
  
  if (!endpoint) {
    throw new Error(`Invalid route: ${route}. No endpoint mapping found.`);
  }
  
  return endpoint;
}
