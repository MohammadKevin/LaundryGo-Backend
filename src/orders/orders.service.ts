import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  OrderStatus,
  Role,
} from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

import { AssignCourierDto } from './dto/assign-courier.dto'
import { CreateOrderDto } from './dto/create-order.dto'
import { RejectOrderDto } from './dto/reject-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    customerId: string,
    dto: CreateOrderDto,
  ) {
    const service =
      await this.prisma.laundryService.findUnique({
        where: {
          id: dto.serviceId,
        },
      })

    if (!service) {
      throw new NotFoundException(
        'Laundry service not found',
      )
    }

    const orderNumber = `LG-${Date.now()}`

    return this.prisma.order.create({
      data: {
        orderNumber,
        customerId,
        serviceId: dto.serviceId,
        outletId: dto.outletId,
        deliveryMethod: dto.deliveryMethod,
        pickupAddress: dto.pickupAddress,
        note: dto.note,
        voucherId: dto.voucherId,
      },
      include: {
        customer: true,
        service: true,
        outlet: true,
      },
    })
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        courier: true,
        staff: true,
        service: true,
        outlet: true,
        payment: true,
        voucher: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        courier: true,
        staff: true,
        service: true,
        outlet: true,
        payment: true,
        review: true,
      },
    })

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      )
    }

    return order
  }

  async assignCourier(
    id: string,
    dto: AssignCourierDto,
  ) {
    await this.findById(id)

    const courier = await this.prisma.user.findFirst({
      where: {
        id: dto.courierId,
        role: Role.KURIR,
      },
    })

    if (!courier) {
      throw new BadRequestException(
        'Courier not found',
      )
    }

    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        courierId: dto.courierId,
        status: OrderStatus.KURIR_DITUGASKAN,
      },
    })
  }

  async reject(
    id: string,
    dto: RejectOrderDto,
  ) {
    await this.findById(id)

    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: OrderStatus.DITOLAK,
        rejectReason: dto.rejectReason,
      },
    })
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ) {
    await this.findById(id)

    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: dto.status,
      },
    })
  }
}
