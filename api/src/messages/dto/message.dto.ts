import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class OpenConversationDto {
  @IsUUID('4', { message: 'İlan seçin.' })
  listingId!: string;

  @IsUUID('4', { message: 'Mağaza seçin.' })
  storeId!: string;
}

export class SendMessageDto {
  @IsString()
  @MinLength(1, { message: 'Mesaj yazın.' })
  @MaxLength(2000, { message: 'Mesaj en fazla 2000 karakter olabilir.' })
  body!: string;
}
