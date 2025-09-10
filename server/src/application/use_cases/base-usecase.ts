import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export abstract class BaseUseCase<DTO extends object, Response> {
  protected async validateDto(
    dtoClass: new () => DTO,
    data: DTO | Record<string, unknown> 
  ): Promise<DTO> {
    const dto = plainToInstance(dtoClass, data);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors
        .map(err => Object.values(err.constraints || {}))
        .flat()
        .join(", ");
      throw new Error(messages);
    }
    return dto;
  }

  abstract execute(dto: DTO): Promise<Response>;
}
