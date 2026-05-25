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

import { CreateLaundryServiceDto } from './dto/create-laundry-service.dto'
import { UpdateLaundryServiceDto } from './dto/update-laundry-service.dto'

import { LaundryServicesService } from './laundry-services.service'

@Controller('laundry-services')
export class LaundryServicesController {
  constructor(
    private readonly laundryServicesService: LaundryServicesService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.STAFF)
  @Post()
  create(@Body() dto: CreateLaundryServiceDto) {
    return this.laundryServicesService.create(dto)
  }

  @Get()
  findAll() {
    return this.laundryServicesService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.laundryServicesService.findById(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.STAFF)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLaundryServiceDto,
  ) {
    return this.laundryServicesService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laundryServicesService.remove(id)
  }
}