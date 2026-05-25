import { DeliveryMethod } from '@prisma/client'

import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateOrderDto {
  @IsString()
  serviceId!: string

  @IsString()
  outletId!: string

  @IsEnum(DeliveryMethod)
  deliveryMethod!: DeliveryMethod

  @IsOptional()
  @IsString()
  pickupAddress?: string

  @IsOptional()
  @IsString()
  note?: string

  @IsOptional()
  @IsString()
  voucherId?: string
}