import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class CreateOutletDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  address!: string

  @IsPhoneNumber('ID')
  phone!: string
}