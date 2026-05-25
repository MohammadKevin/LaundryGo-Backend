import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'

import { Role } from '@prisma/client'

import { Roles } from '../auth/decorators/roles.decorator'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { UpdateCourierOrderStatusDto } from './dto/update-courier-order-status.dto'

import { CouriersService } from './couriers.service'

@Controller('couriers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.KURIR)
export class CouriersController {
  constructor(
    private readonly couriersService: CouriersService,
  ) {}

  @Get('my-tasks')
  getMyTasks(@Req() req: any) {
    return this.couriersService.getMyTasks(
      req.user.id,
    )
  }

  @Get('history')
  getHistory(@Req() req: any) {
    return this.couriersService.getHistory(
      req.user.id,
    )
  }

  @Get('statistics')
  getStatistics(@Req() req: any) {
    return this.couriersService.getStatistics(
      req.user.id,
    )
  }

  @Patch('orders/:id/status')
  updateOrderStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCourierOrderStatusDto,
  ) {
    return this.couriersService.updateOrderStatus(
      req.user.id,
      id,
      dto,
    )
  }
}