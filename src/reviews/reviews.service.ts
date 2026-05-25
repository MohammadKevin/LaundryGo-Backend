import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  OrderStatus,
} from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

import { CreateReviewDto } from './dto/create-review.dto'

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateReviewDto,
  ) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
        customerId: userId,
      },
    })

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      )
    }

    if (order.status !== OrderStatus.SELESAI) {
      throw new BadRequestException(
        'Order is not completed',
      )
    }

    const existingReview =
      await this.prisma.review.findUnique({
        where: {
          orderId: dto.orderId,
        },
      })

    if (existingReview) {
      throw new BadRequestException(
        'Review already exists',
      )
    }

    return this.prisma.review.create({
      data: {
        orderId: dto.orderId,
        userId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: true,
        order: true,
      },
    })
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: true,
        order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findById(id: string) {
    const review =
      await this.prisma.review.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
          order: true,
        },
      })

    if (!review) {
      throw new NotFoundException(
        'Review not found',
      )
    }

    return review
  }
}