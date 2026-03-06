import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsListingService } from './products-listing.service';
import { WarehouseService } from './warehouse.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductListDto } from './dto/get-product-list.dto';
import { UpdateWarehouseConfigDto } from './dto/update-warehouse-config.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private listingService: ProductsListingService,
    private warehouseService: WarehouseService,
  ) {}

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findAll({
      type,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  // New listing endpoints for fixed routes
  @Get('email')
  getEmailProducts(@Query() query: GetProductListDto, @Request() req) {
    const userId = req.user?.userId;
    return this.listingService.getProductList('email', query, userId);
  }

  @Get('software')
  getSoftwareProducts(@Query() query: GetProductListDto, @Request() req) {
    const userId = req.user?.userId;
    return this.listingService.getProductList('software', query, userId);
  }

  @Get('account')
  getAccountProducts(@Query() query: GetProductListDto, @Request() req) {
    const userId = req.user?.userId;
    return this.listingService.getProductList('account', query, userId);
  }

  @Get('other')
  getOtherProducts(@Query() query: GetProductListDto, @Request() req) {
    const userId = req.user?.userId;
    return this.listingService.getProductList('other', query, userId);
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string, @Request() req) {
    const userId = req.user?.userId;
    const product = await this.listingService.getProductBySlug(slug, userId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Public endpoint — proxies test connection to external warehouse API (avoids CORS)
  @Post('warehouse/test-url')
  async testWarehouseUrl(@Body() body: { apiUrl: string; apiKey?: string }) {
    if (!body.apiUrl) {
      return { success: false, message: 'Vui lòng nhập API URL' };
    }
    return this.warehouseService.testConnection(body.apiUrl, body.apiKey);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.listingService.toggleFavorite(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/warehouse')
  async getWarehouseConfig(@Param('id') id: string, @Request() req) {
    return this.productsService.getWarehouseConfig(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/warehouse')
  async updateWarehouseConfig(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateWarehouseConfigDto,
  ) {
    return this.productsService.updateWarehouseConfig(id, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/warehouse/test')
  async testWarehouseConnection(@Param('id') id: string, @Request() req) {
    const config = await this.productsService.getWarehouseConfig(id, req.user.userId);
    if (!config.warehouseApiUrl || !config.warehouseApiKey) {
      return { success: false, message: 'Chưa cấu hình API URL hoặc API Key' };
    }
    return this.warehouseService.testConnection(config.warehouseApiUrl, config.warehouseApiKey);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/warehouse/stock')
  async getWarehouseStock(@Param('id') id: string, @Request() req) {
    const config = await this.productsService.getWarehouseConfig(id, req.user.userId);
    if (!config.usePrivateWarehouse || !config.warehouseApiUrl || !config.warehouseApiKey) {
      return { available: false, stock: 0 };
    }
    return this.warehouseService.checkStock(config.warehouseApiUrl, config.warehouseApiKey);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(req.user.shopId, createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, req.user.userId, updateProductDto);
  }
}
