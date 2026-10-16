import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @MinLength(2, { message: 'Mağaza adı en az 2 karakter olmalı.' })
  @MaxLength(120, { message: 'Mağaza adı en fazla 120 karakter olabilir.' })
  name!: string;

  @IsString()
  @MinLength(2, { message: 'Şehir yazın.' })
  @MaxLength(80, { message: 'Şehir en fazla 80 karakter olabilir.' })
  city!: string;

  @IsString()
  @MinLength(5, { message: 'Adres en az 5 karakter olmalı.' })
  @MaxLength(240, { message: 'Adres en fazla 240 karakter olabilir.' })
  address!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Hakkında metni en fazla 2000 karakter olabilir.' })
  about?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(14, { message: 'En fazla 14 çalışma saati satırı yazılabilir.' })
  @IsString({ each: true })
  @MaxLength(80, {
    each: true,
    message: 'Çalışma saati satırı en fazla 80 karakter olabilir.',
  })
  hours?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8, { message: 'En fazla 8 rozet yazılabilir.' })
  @IsString({ each: true })
  @MaxLength(40, { each: true, message: 'Rozet en fazla 40 karakter olabilir.' })
  badges?: string[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Puan 0 ile 5 arasında, tek ondalık olmalı.' })
  @Min(0, { message: 'Puan 0 ile 5 arasında olmalı.' })
  @Max(5, { message: 'Puan 0 ile 5 arasında olmalı.' })
  rating?: number | null;

  @IsOptional()
  @IsInt({ message: 'Değerlendirme sayısı tam sayı olmalı.' })
  @Min(0, { message: 'Değerlendirme sayısı negatif olamaz.' })
  reviewCount?: number | null;
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Mağaza adı en az 2 karakter olmalı.' })
  @MaxLength(120, { message: 'Mağaza adı en fazla 120 karakter olabilir.' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Şehir yazın.' })
  @MaxLength(80, { message: 'Şehir en fazla 80 karakter olabilir.' })
  city?: string;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Adres en az 5 karakter olmalı.' })
  @MaxLength(240, { message: 'Adres en fazla 240 karakter olabilir.' })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Hakkında metni en fazla 2000 karakter olabilir.' })
  about?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(14, { message: 'En fazla 14 çalışma saati satırı yazılabilir.' })
  @IsString({ each: true })
  @MaxLength(80, {
    each: true,
    message: 'Çalışma saati satırı en fazla 80 karakter olabilir.',
  })
  hours?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8, { message: 'En fazla 8 rozet yazılabilir.' })
  @IsString({ each: true })
  @MaxLength(40, { each: true, message: 'Rozet en fazla 40 karakter olabilir.' })
  badges?: string[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Puan 0 ile 5 arasında, tek ondalık olmalı.' })
  @Min(0, { message: 'Puan 0 ile 5 arasında olmalı.' })
  @Max(5, { message: 'Puan 0 ile 5 arasında olmalı.' })
  rating?: number | null;

  @IsOptional()
  @IsInt({ message: 'Değerlendirme sayısı tam sayı olmalı.' })
  @Min(0, { message: 'Değerlendirme sayısı negatif olamaz.' })
  reviewCount?: number | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
