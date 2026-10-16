import {
  IsIn,
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

  @IsOptional()
  @IsIn(['on', 'kesin'], { message: 'Teklif türü ön teklif veya kesin teklif olmalı.' })
  kind?: 'on' | 'kesin';

  @IsOptional()
  @IsIn(['uyusmazlik', 'keyfi'], { message: 'Fiyat düşüşünün nedenini seçin.' })
  dropReason?: 'uyusmazlik' | 'keyfi';
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

  @IsOptional()
  @IsIn(['on', 'kesin'], { message: 'Teklif türü ön teklif veya kesin teklif olmalı.' })
  kind?: 'on' | 'kesin';

  @IsOptional()
  @IsIn(['uyusmazlik', 'keyfi'], { message: 'Fiyat düşüşünün nedenini seçin.' })
  dropReason?: 'uyusmazlik' | 'keyfi';
}
