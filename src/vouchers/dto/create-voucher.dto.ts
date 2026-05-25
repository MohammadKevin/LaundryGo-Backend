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
  expiredAt!: string

  @IsBoolean()
  isActive!: boolean

  @IsString()
  outletId!: string
}