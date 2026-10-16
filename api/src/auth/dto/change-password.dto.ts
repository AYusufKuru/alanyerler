import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8, { message: 'Mevcut şifre en az 8 karakter olmalı.' })
  @MaxLength(72)
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'Yeni şifre en az 8 karakter olmalı.' })
  @MaxLength(72, { message: 'Yeni şifre en fazla 72 karakter olabilir.' })
  newPassword!: string;
}
