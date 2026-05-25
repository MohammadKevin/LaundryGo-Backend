import {
  PaymentMethod,
} from '@prisma/client'

import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreatePaymentDto {
  @IsString()
  orderId!: string

  @IsNumber()
  amount!: number

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod

  @IsOptional()
  @IsString()
  paymentProof?: string
}