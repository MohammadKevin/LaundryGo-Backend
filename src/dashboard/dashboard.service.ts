import { Injectable } from '@nestjs/common'

import {
  OrderStatus,
  Role,
} from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatistics() {
    const [
      totalUsers,
      totalCustomers,
      totalStaff,
      totalCouriers,
      totalOutlets,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.user.count(),

      this.prisma.user.count({
        where: {
          role: Role.PELANGGAN,
        },
      }),

      this.prisma.user.count({
        where: {
          role: Role.STAFF,
        },
      }),

      this.prisma.user.count({
        where: {
          role: Role.KURIR,
        },
      }),

      this.prisma.outlet.count(),

      this.prisma.order.count(),

      this.prisma.order.count({
        where: {
          status: OrderStatus.SELESAI,
        },
      }),

      this.prisma.order.count({
        where: {
          status: {
            not: OrderStatus.SELESAI,
          },
        },
      }),

      this.prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ])

    return {
      totalUsers,
      totalCustomers,
      totalStaff,
      totalCouriers,
      totalOutlets,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue:
        totalRevenue._sum.amount || 0,
    }
  }

  async getOutletStatistics(outletId: string) {
    const [
      totalOrders,
      completedOrders,
      totalRevenue,
      totalCustomers,
    ] = await Promise.all([
      this.prisma.order.count({
        where: {
          outletId,
        },
      }),

      this.prisma.order.count({
        where: {
          outletId,
          status: OrderStatus.SELESAI,
        },
      }),

      this.prisma.payment.aggregate({
        where: {
          order: {
            outletId,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      this.prisma.order.groupBy({
        by: ['customerId'],
        where: {
          outletId,
        },
      }),
    ])

    return {
      totalOrders,
      completedOrders,
      totalRevenue:
        totalRevenue._sum.amount || 0,
      totalCustomers: totalCustomers.length,
    }
  }
}
