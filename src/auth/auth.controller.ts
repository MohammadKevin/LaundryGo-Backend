import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'

import { Role } from '@prisma/client'

import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard } from './guards/roles.guard'

import { Roles } from './decorators/roles.decorator'

import { AuthService } from './auth.service'

import { CreateCourierDto } from './dto/create-courier.dto'
import { CreateStaffDto } from './dto/create-staff.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('create-staff')
  createStaff(@Body() dto: CreateStaffDto) {
    return this.authService.createStaff(dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('create-courier')
  createCourier(@Body() dto: CreateCourierDto) {
    return this.authService.createCourier(dto)
  }
}