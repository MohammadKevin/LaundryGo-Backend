import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'

import {
  Role,
} from '@prisma/client'

import { Roles } from '../auth/decorators/roles.decorator'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { WhatsappService } from './whatsapp.service'

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.STAFF)
  @Get('order/:id')
  generateOrderWhatsapp(
    @Param('id') id: string,
  ) {
    return this.whatsappService.generateOrderWhatsapp(
      id,
    )
  }
}