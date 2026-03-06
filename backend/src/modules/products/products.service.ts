import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CacheService } from '@/cache/cache.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateWarehouseConfigDto } from './dto/update-warehouse-config.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async create(shopId: string, createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        shopId,
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            rating: true,
          },
        },
      },
    });

    // Invalidate products list cache
    await this.cacheService.invalidateProductsList();

    return product;
  }

  async findAll(filters?: { type?: string; search?: string; page?: number; limit?: number }) {
    const { type, search, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;

    // Generate cache key
    const cacheKey = `list:${type || 'all'}:${search || 'none'}:${page}:${limit}`;
    
    // Try to get from cache
    const cached = await this.cacheService.getProductsList(cacheKey);
    if (cached) {
      return cached;
    }

    const where: any = { isActive: true };

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              rating: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const result = {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    await this.cacheService.setProductsList(cacheKey, result);

    return result;
  }

  async findOne(id: string) {
    // Try to get from cache
    const cached = await this.cacheService.getProduct(id);
    if (cached) {
      return cached;
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            rating: true,
            totalSales: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Cache the product
    await this.cacheService.setProduct(id, product);

    return product;
  }

  async update(id: string, userId: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shop.userId !== userId) {
      throw new ForbiddenException('You can only update your own products');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    // Invalidate caches
    await this.cacheService.invalidateProduct(id);
    await this.cacheService.invalidateProductsList();

    return updated;
  }

  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    return product ? product.stock >= quantity : false;
  }

  async decrementStock(productId: string, quantity: number) {
    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: {
        stock: { decrement: quantity },
        sold: { increment: quantity },
      },
    });

    // Invalidate cache
    await this.cacheService.invalidateProduct(productId);

    return updated;
  }

  async getWarehouseConfig(productId: string, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shop.userId !== userId) {
      throw new ForbiddenException('You can only access your own products');
    }

    return {
      usePrivateWarehouse: product.usePrivateWarehouse,
      warehouseApiUrl: product.warehouseApiUrl,
      warehouseApiKey: product.warehouseApiKey,
    };
  }

  async updateWarehouseConfig(productId: string, userId: string, dto: UpdateWarehouseConfigDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shop.userId !== userId) {
      throw new ForbiddenException('You can only update your own products');
    }

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: {
        usePrivateWarehouse: dto.usePrivateWarehouse,
        warehouseApiUrl: dto.usePrivateWarehouse ? dto.warehouseApiUrl : null,
        warehouseApiKey: dto.usePrivateWarehouse ? dto.warehouseApiKey : null,
      },
    });

    await this.cacheService.invalidateProduct(productId);

    return {
      usePrivateWarehouse: updated.usePrivateWarehouse,
      warehouseApiUrl: updated.warehouseApiUrl,
      warehouseApiKey: updated.warehouseApiKey,
    };
  }
}
