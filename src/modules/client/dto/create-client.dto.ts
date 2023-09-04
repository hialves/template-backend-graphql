import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateClientDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string

  @IsOptional()
  photo?: string

  @IsOptional()
  cardToken?: string

  @IsOptional()
  googleToken?: string

  @IsOptional()
  facebookToken?: string

  @IsOptional()
  phone?: string
}
