import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

import { CreateLaundryServiceDto } from './dto/create-laundry-service.dto'
import { UpdateLaundryServiceDto } from './dto/update-laundry-service.dto'

@Injectable()
export class LaundryServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLaundryServiceDto) {
    const existingService =
      await this.prisma.laundryService.findFirst({
        where: {
          name: dto.name,
          outletId: dto.outletId,
        },
      })

    if (existingService) {
      throw new BadRequestException(
        'Laundry service already exists',
      )
    }

    return this.prisma.laundryService.create({
      data: dto,
    })
  }

  async findAll() {
    return this.prisma.laundryService.findMany({
      include: {
        outlet: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findById(id: string) {
    const laundryService =
      await this.prisma.laundryService.findUnique({
        where: {
          id,
        },
        include: {
          outlet: true,
          orders: true,
        },
      })

    if (!laundryService) {
      throw new NotFoundException(
        'Laundry service not found',
      )
    }

    return laundryService
  }

  async update(
    id: string,
    dto: UpdateLaundryServiceDto,
  ) {
    await this.findById(id)

    return this.prisma.laundryService.update({
      where: {
        id,
      },
      data: dto,
    })
  }

  async remove(id: string) {
    await this.findById(id)

    return this.prisma.laundryService.delete({
      where: {
        id,
      },
    })
  }
}