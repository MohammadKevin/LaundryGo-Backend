import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  Min,
} from 'class-validator'

export class CreateVoucherDto {
  @IsString()
  code!: string

  @IsNumber()
  @Min(0)
  discount!: number

  @IsDateString()
  expiredAt!: Date

  @IsBoolean()
  isActive!: boolean

  @IsString()
  outletId!: string
}