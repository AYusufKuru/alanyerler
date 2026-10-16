import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2, { message: 'Ad soyad en az 2 karakter olmalı.' })
  @MaxLength(120, { message: 'Ad soyad en fazla 120 karakter olabilir.' })
  name!: string;

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
