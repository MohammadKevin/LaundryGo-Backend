import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

import { CreateVoucherDto } from './dto/create-voucher.dto'
import { UpdateVoucherDto } from './dto/update-voucher.dto'

@Injectable()
export class VouchersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVoucherDto) {
    const existingVoucher =
      await this.prisma.voucher.findUnique({
        where: {
          code: dto.code,
        },
      })

    if (existingVoucher) {
      throw new BadRequestException(
        'Voucher already exists',
      )
    }

    return this.prisma.voucher.create({
      data: dto,
    })
  }

  async findAll() {
    return this.prisma.voucher.findMany({
      include: {
        outlet: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findById(id: string) {
    const voucher =
      await this.prisma.voucher.findUnique({
        where: {
          id,
        },
        include: {
          outlet: true,
        },
      })

    if (!voucher) {
      throw new NotFoundException(
        'Voucher not found',
      )
    }

    return voucher
  }

  async update(
    id: string,
    dto: UpdateVoucherDto,
  ) {
    await this.findById(id)

    return this.prisma.voucher.update({
      where: {
        id,
      },
      data: dto,
    })
  }

  async remove(id: string) {
    await this.findById(id)

    return this.prisma.voucher.delete({
      where: {
        id,
      },
    })
  }
}
