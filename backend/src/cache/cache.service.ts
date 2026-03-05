import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Generic cache operations
  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }

  // Product cache
  async getProduct(productId: string) {
    return this.get(`product:${productId}`);
  }

  async setProduct(productId: string, product: any, ttl = 300000) {
    // 5 minutes
    await this.set(`product:${productId}`, product, ttl);
  }

  async invalidateProduct(productId: string) {
    await this.del(`product:${productId}`);
  }

  // Products list cache
  async getProductsList(cacheKey: string) {
    return this.get(`products:${cacheKey}`);
  }

  async setProductsList(cacheKey: string, products: any, ttl = 60000) {
    // 1 minute
    await this.set(`products:${cacheKey}`, products, ttl);
  }

  async invalidateProductsList() {
    // In production, use Redis SCAN to find and delete all products:* keys
    // For now, just reset the entire cache
    await this.reset();
  }

  // User cache
  async getUser(userId: string) {
    return this.get(`user:${userId}`);
  }

  async setUser(userId: string, user: any, ttl = 600000) {
    // 10 minutes
    await this.set(`user:${userId}`, user, ttl);
  }

  async invalidateUser(userId: string) {
    await this.del(`user:${userId}`);
  }

  // Shop cache
  async getShop(shopId: string) {
    return this.get(`shop:${shopId}`);
  }

  async setShop(shopId: string, shop: any, ttl = 300000) {
    // 5 minutes
    await this.set(`shop:${shopId}`, shop, ttl);
  }

  async invalidateShop(shopId: string) {
    await this.del(`shop:${shopId}`);
  }

  // Order cache
  async getOrder(orderId: string) {
    return this.get(`order:${orderId}`);
  }

  async setOrder(orderId: string, order: any, ttl = 180000) {
    // 3 minutes
    await this.set(`order:${orderId}`, order, ttl);
  }

  async invalidateOrder(orderId: string) {
    await this.del(`order:${orderId}`);
  }

  // Session/Auth cache
  async getSession(sessionId: string) {
    return this.get(`session:${sessionId}`);
  }

  async setSession(sessionId: string, session: any, ttl = 86400000) {
    // 24 hours
    await this.set(`session:${sessionId}`, session, ttl);
  }

  async invalidateSession(sessionId: string) {
    await this.del(`session:${sessionId}`);
  }

  // Rate limiting
  async incrementRateLimit(key: string, ttl = 60000): Promise<number> {
    const current = (await this.get<number>(key)) || 0;
    const newValue = current + 1;
    await this.set(key, newValue, ttl);
    return newValue;
  }

  async getRateLimit(key: string): Promise<number> {
    return (await this.get<number>(key)) || 0;
  }
}
