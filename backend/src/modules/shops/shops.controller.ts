import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Controller('shops')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(req.user.userId, createShopDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-shop')
  findMyShop(@Request() req) {
    return this.shopsService.findByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Request() req, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(req.user.userId, updateShopDto);
  }
}
