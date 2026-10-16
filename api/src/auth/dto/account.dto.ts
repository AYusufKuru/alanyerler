import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Ad en az 2 karakter olmalı.' })
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsBoolean()
  notifyOffers?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyMessages?: boolean;
}

export class DeleteAccountDto {
  @IsString()
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalı.' })
  @MaxLength(72)
  password!: string;
}
