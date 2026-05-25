import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'

import { Role } from '@prisma/client'

import { Roles } from '../auth/decorators/roles.decorator'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { DashboardService } from './dashboard.service'

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.STAFF)
  @Get('statistics')
  getStatistics() {
    return this.dashboardService.getStatistics()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.STAFF)
  @Get('outlet/:outletId')
  getOutletStatistics(
    @Param('outletId') outletId: string,
  ) {
    return this.dashboardService.getOutletStatistics(
      outletId,
    )
  }
}