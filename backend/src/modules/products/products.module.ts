import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsListingService } from './products-listing.service';
import { WarehouseService } from './warehouse.service';
import { ProductsController } from './products.controller';
import { ServicesController } from './services.controller';
import { CacheModule } from '@/cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [ProductsService, ProductsListingService, WarehouseService],
  controllers: [ProductsController, ServicesController],
  exports: [ProductsService, ProductsListingService, WarehouseService],
})
export class ProductsModule {}
