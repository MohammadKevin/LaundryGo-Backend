import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

import { CreateOutletDto } from './dto/create-outlet.dto'
import { UpdateOutletDto } from './dto/update-outlet.dto'

@Injectable()
export class OutletsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOutletDto) {
    const existingOutlet = await this.prisma.outlet.findFirst({
      where: {
        OR: [
          {
            name: dto.name,
          },
          {
            phone: dto.phone,
          },
        ],
      },
    })

    if (existingOutlet) {
      throw new BadRequestException('Outlet already exists')
    }

    return this.prisma.outlet.create({
      data: dto,
    })
  }

  async findAll() {
    return this.prisma.outlet.findMany({
      include: {
        users: true,
        services: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findById(id: string) {
    const outlet = await this.prisma.outlet.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
        services: true,
        orders: true,
      },
    })

    if (!outlet) {
      throw new NotFoundException('Outlet not found')
    }

    return outlet
  }

  async update(id: string, dto: UpdateOutletDto) {
    await this.findById(id)

    return this.prisma.outlet.update({
      where: {
        id,
      },
      data: dto,
    })
  }

  async remove(id: string) {
    await this.findById(id)

    return this.prisma.outlet.delete({
      where: {
        id,
      },
    })
  }
}