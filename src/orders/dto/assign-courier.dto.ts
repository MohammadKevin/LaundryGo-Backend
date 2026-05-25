import { IsString } from 'class-validator'

export class AssignCourierDto {
  @IsString()
  courierId!: string
}