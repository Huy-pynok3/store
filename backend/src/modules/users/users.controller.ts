import { Controller, Get, UseGuards, Request, Query, Inject, forwardRef } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ProductsListingService } from '../products/products-listing.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    @Inject(forwardRef(() => ProductsListingService))
    private listingService: ProductsListingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/favorites')
  async getFavorites(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listingService.getUserFavorites(
      req.user.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 12,
    );
  }
}
