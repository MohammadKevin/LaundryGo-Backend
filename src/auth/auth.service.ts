import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'

import { Role } from '@prisma/client'

import * as bcrypt from 'bcrypt'

import { PrismaService } from '../prisma/prisma.service'

import { CreateCourierDto } from './dto/create-courier.dto'
import { CreateStaffDto } from './dto/create-staff.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    })

    if (existingUser) {
      throw new BadRequestException('User already exists')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        password: hashedPassword,
        role: Role.PELANGGAN,
      },
    })

    return this.generateToken(user.id, user.email, user.role)
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.generateToken(user.id, user.email, user.role)
  }

  async createStaff(dto: CreateStaffDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        password: hashedPassword,
        outletId: dto.outletId,
        role: Role.STAFF,
      },
    })
  }

  async createCourier(dto: CreateCourierDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        password: hashedPassword,
        outletId: dto.outletId,
        role: Role.KURIR,
      },
    })
  }

  private async generateToken(
    id: string,
    email: string,
    role: Role,
  ) {
    const payload = {
      sub: id,
      email,
      role,
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
