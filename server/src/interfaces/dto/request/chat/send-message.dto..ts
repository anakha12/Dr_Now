import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ChatRole } from "../../../../utils/Constance";

export class SendMessageRequestDTO {

  @IsMongoId()
  bookingId!: string;

  @IsMongoId()
  senderId!: string;

  @IsEnum(ChatRole)
  senderRole!: ChatRole;

  @IsString()
  @IsNotEmpty()
  message!: string;
}
