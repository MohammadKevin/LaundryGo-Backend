import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateLaundryServiceDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @Min(0)
  price!: number

  @IsNumber()
  @Min(1)
  estimatedHour!: number

  @IsBoolean()
  isExpress!: boolean

  @IsString()
  outletId!: string
}