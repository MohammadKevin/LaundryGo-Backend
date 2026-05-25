import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  PaymentStatus,
} from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto'

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: dto.orderId,
      },
    })

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      )
    }

    const existingPayment =
      await this.prisma.payment.findUnique({
        where: {
          orderId: dto.orderId,
        },
      })

    if (existingPayment) {
      throw new BadRequestException(
        'Payment already exists',
      )
    }

    return this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        amount: dto.amount,
        paymentMethod: dto.paymentMethod,
        paymentProof: dto.paymentProof,
      },
    })
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findById(id: string) {
    const payment =
      await this.prisma.payment.findUnique({
        where: {
          id,
        },
        include: {
          order: true,
        },
      })

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      )
    }

    return payment
  }

  async updateStatus(
    id: string,
    dto: UpdatePaymentStatusDto,
  ) {
    await this.findById(id)

    return this.prisma.payment.update({
      where: {
        id,
      },
      data: {
        paymentStatus: dto.paymentStatus,
        paidAt:
          dto.paymentStatus === PaymentStatus.PAID
            ? new Date()
            : null,
      },
    })
  }
}
