import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator'

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsEmail()
  email!: string

  @IsPhoneNumber('ID')
  phone!: string

  @IsString()
  @MinLength(6)
  password!: string

  @IsString()
  address!: string

  @IsString()
  outletId!: string
}