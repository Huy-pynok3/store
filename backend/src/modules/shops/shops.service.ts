import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createShopDto: CreateShopDto) {
    const existingShop = await this.prisma.shop.findUnique({
      where: { userId },
    });

    if (existingShop) {
      throw new ConflictException('User already has a shop');
    }

    const shop = await this.prisma.shop.create({
      data: {
        ...createShopDto,
        userId,
      },
    });

    // Update user role to SELLER
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'SELLER' },
    });

    return shop;
  }

  async findByUserId(userId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { userId },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }

  async findOne(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }

  async update(userId: string, updateShopDto: UpdateShopDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { userId },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return this.prisma.shop.update({
      where: { userId },
      data: updateShopDto,
    });
  }
}
