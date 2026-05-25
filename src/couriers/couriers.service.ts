import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  OrderStatus,
} from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

import { UpdateCourierOrderStatusDto } from './dto/update-courier-order-status.dto'

@Injectable()
export class CouriersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyTasks(courierId: string) {
    return this.prisma.order.findMany({
      where: {
        courierId,
        status: {
          notIn: [
            OrderStatus.SELESAI,
            OrderStatus.DITOLAK,
          ],
        },
      },
      include: {
        customer: true,
        service: true,
        outlet: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getHistory(courierId: string) {
    return this.prisma.order.findMany({
      where: {
        courierId,
        status: OrderStatus.SELESAI,
      },
      include: {
        customer: true,
        service: true,
        outlet: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  }

  async updateOrderStatus(
    courierId: string,
    orderId: string,
    dto: UpdateCourierOrderStatusDto,
  ) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        courierId,
      },
    })

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      )
    }

    const allowedStatuses: OrderStatus[] = [
      OrderStatus.LAUNDRY_DIJEMPUT,
      OrderStatus.SEDANG_DIANTAR,
      OrderStatus.SELESAI,
    ]

    if (!allowedStatuses.includes(dto.status)) {
      throw new BadRequestException(
        'Invalid courier status',
      )
    }

    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: dto.status,
      },
    })
  }

  async getStatistics(courierId: string) {
    const [
      totalTasks,
      completedTasks,
      activeTasks,
    ] = await Promise.all([
      this.prisma.order.count({
        where: {
          courierId,
        },
      }),

      this.prisma.order.count({
        where: {
          courierId,
          status: OrderStatus.SELESAI,
        },
      }),

      this.prisma.order.count({
        where: {
          courierId,
          status: {
            notIn: [
              OrderStatus.SELESAI,
              OrderStatus.DITOLAK,
            ],
          },
        },
      }),
    ])

    return {
      totalTasks,
      completedTasks,
      activeTasks,
    }
  }
}