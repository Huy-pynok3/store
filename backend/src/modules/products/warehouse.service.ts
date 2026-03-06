import { Injectable, Logger } from '@nestjs/common';

export interface WarehouseStockResponse {
  available: boolean;
  stock: number;
}

export interface WarehouseItemResponse {
  data: string;
}

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);
  private readonly TIMEOUT_MS = 10_000;

  /**
   * Test connection to an external warehouse API.
   * Supports both full URL with query params (e.g. ?api_key=XXX) and Bearer token auth.
   */
  async testConnection(apiUrl: string, apiKey?: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(this.TIMEOUT_MS),
      });

      if (response.ok) {
        let data: any = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await response.json();
        }
        return { success: true, message: 'Kết nối thành công', data };
      }

      return { success: false, message: `Server trả về lỗi: ${response.status}` };
    } catch (error) {
      this.logger.warn(`Warehouse connection test failed: ${error.message}`);

      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        return { success: false, message: 'Kết nối quá thời gian (timeout)' };
      }

      return { success: false, message: `Không thể kết nối: ${error.message}` };
    }
  }

  async checkStock(apiUrl: string, apiKey?: string): Promise<WarehouseStockResponse> {
    try {
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(this.TIMEOUT_MS),
      });

      if (!response.ok) {
        this.logger.warn(`Warehouse stock check failed: ${response.status}`);
        return { available: false, stock: 0 };
      }

      const data = await response.json();
      return {
        available: (data.stock ?? 0) > 0,
        stock: data.stock ?? 0,
      };
    } catch (error) {
      this.logger.error(`Warehouse stock check error: ${error.message}`);
      return { available: false, stock: 0 };
    }
  }

  async fetchItem(apiUrl: string, apiKey?: string, quantity: number = 1): Promise<WarehouseItemResponse | null> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ quantity }),
        signal: AbortSignal.timeout(this.TIMEOUT_MS),
      });

      if (!response.ok) {
        this.logger.warn(`Warehouse fetch item failed: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Warehouse fetch item error: ${error.message}`);
      return null;
    }
  }
}
