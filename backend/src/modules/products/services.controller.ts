import { Controller, Get, Query, Request } from '@nestjs/common';
import { ProductsListingService } from './products-listing.service';
import { GetProductListDto } from './dto/get-product-list.dto';

@Controller('services')
export class ServicesController {
  constructor(private listingService: ProductsListingService) {}

  @Get('engagement')
  getEngagementServices(@Query() query: GetProductListDto, @Request() req) {
    const userId = req.user?.userId;
    return this.listingService.getProductList('engagement', query, userId);
  }

  @Get('software')
  getSoftwareServices(@Query() query: GetProductListDto, @Request() req) {
    const userId = req.user?.userId;
    return this.listingService.getProductList('service-software', query, userId);
  }

  @Get('blockchain')
  getBlockchainServices(@Query() query: GetProductListDto, @Request() req) {
    const userId = req.user?.userId;
    return this.listingService.getProductList('blockchain', query, userId);
  }

  @Get('other')
  getOtherServices(@Query() query: GetProductListDto, @Request() req) {
    const userId = req.user?.userId;
    return this.listingService.getProductList('service-other', query, userId);
  }
}
