import { OrderStatus } from '@prisma/client'

import { IsEnum } from 'class-validator'

export class UpdateCourierOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus
}