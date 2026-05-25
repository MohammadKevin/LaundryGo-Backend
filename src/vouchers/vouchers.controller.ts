import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { Role } from '@prisma/client'

import { Roles } from '../auth/decorators/roles.decorator'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { CreateVoucherDto } from './dto/create-voucher.dto'
import { UpdateVoucherDto } from './dto/update-voucher.dto'

import { VouchersService } from './vouchers.service'

@Controller('vouchers')
export class VouchersController {
  constructor(
    private readonly vouchersService: VouchersService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.STAFF)
  @Post()
  create(@Body() dto: CreateVoucherDto) {
    return this.vouchersService.create(dto)
  }

  @Get()
  findAll() {
    return this.vouchersService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.vouchersService.findById(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.STAFF)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVoucherDto,
  ) {
    return this.vouchersService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(id)
  }
}