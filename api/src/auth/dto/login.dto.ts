import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Geçerli bir e-posta girin.' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalı.' })
  @MaxLength(72, { message: 'Şifre en fazla 72 karakter olabilir.' })
  password!: string;
}
