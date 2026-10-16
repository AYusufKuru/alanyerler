import { IsObject, IsUUID } from 'class-validator';

export class CreateListingDto {
  @IsUUID('4', { message: 'Kategori seçin.' })
  categoryId!: string;

  @IsUUID('4', { message: 'Cihaz türü seçin.' })
  deviceTypeId!: string;

  @IsObject({ message: 'Özellikler gerekli.' })
  specs!: Record<string, unknown>;

  @IsObject({ message: 'Durum bilgisi gerekli.' })
  condition!: Record<string, unknown>;
}
