import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'

import { Role } from '@prisma/client'

import { Roles } from '../auth/decorators/roles.decorator'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { AssignCourierDto } from './dto/assign-courier.dto'
import { CreateOrderDto } from './dto/create-order.dto'
import { RejectOrderDto } from './dto/reject-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'

import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(
      req.user.id,
      dto,
    )
  }

  @UseGuards(JwtAuthGuard)
@Get()
findAll() {
  return this.ordersService.findAll()
}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.STAFF)
  @Patch(':id/assign-courier')
  assignCourier(
    @Param('id') id: string,
    @Body() dto: AssignCourierDto,
  ) {
    return this.ordersService.assignCourier(
      id,
      dto,
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.STAFF)
  @Patch(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() dto: RejectOrderDto,
  ) {
    return this.ordersService.reject(id, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.SUPER_ADMIN,
    Role.STAFF,
    Role.KURIR,
  )
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      id,
      dto,
    )
  }
}