
import { IsMongoId } from "class-validator";

export class GetMessagesRequestDTO {
  @IsMongoId({ message: "bookingId must be a valid Mongo ID" })
  bookingId!: string;
}
