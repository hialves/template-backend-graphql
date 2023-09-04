import { IsNotEmpty } from 'class-validator'

export class CreateAdminDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}
