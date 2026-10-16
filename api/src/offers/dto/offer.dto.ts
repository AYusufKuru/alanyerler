import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @IsUUID('4', { message: 'İlan seçin.' })
  listingId!: string;

  @IsUUID('4', { message: 'Mağaza seçin.' })
  storeId!: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Fiyat kuruştan daha küçük olamaz.' })
  @Min(0.01, { message: 'Fiyat sıfırdan büyük olmalı.' })
  @Max(999999999.99, { message: 'Fiyat çok büyük.' })
  price!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Not en fazla 500 karakter olabilir.' })
  note?: string;
}

export class UpdateOfferDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Fiyat kuruştan daha küçük olamaz.' })
  @Min(0.01, { message: 'Fiyat sıfırdan büyük olmalı.' })
  @Max(999999999.99, { message: 'Fiyat çok büyük.' })
  price!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Not en fazla 500 karakter olabilir.' })
  note?: string;
}
