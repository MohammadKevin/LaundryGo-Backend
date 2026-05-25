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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

import { Roles } from '../auth/decorators/roles.decorator'

import { CreateOutletDto } from './dto/create-outlet.dto'
import { UpdateOutletDto } from './dto/update-outlet.dto'

import { OutletsService } from './outlets.service'

@Controller('outlets')
export class OutletsController {
  constructor(
    private readonly outletsService: OutletsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() dto: CreateOutletDto) {
    return this.outletsService.create(dto)
  }

  @Get()
  findAll() {
    return this.outletsService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.outletsService.findById(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOutletDto,
  ) {
    return this.outletsService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outletsService.remove(id)
  }
}