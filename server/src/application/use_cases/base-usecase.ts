import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export abstract class BaseUseCase<DTO extends object, Response> {

  protected async validateDto(
    dtoClass: new () => DTO,
    data: DTO | Record<string, unknown>
  ): Promise<DTO> {

    const dto = plainToInstance(dtoClass, data);
    const errors = await validate(dto, { whitelist: true });

    if (errors.length > 0) {
      const messages = this.extractErrors(errors);
      throw new Error(messages);
    }

    return dto;
  }

  private extractErrors(errors: ValidationError[]): string {
    const result: string[] = [];

    const getErrors = (errs: ValidationError[]) => {
      for (const err of errs) {
        if (err.constraints) {
          result.push(...Object.values(err.constraints));
        }

        if (err.children && err.children.length > 0) {
          getErrors(err.children);
        }
      }
    };

    getErrors(errors);
    return result.join(", ") || "Validation failed";
  }

  abstract execute(dto: DTO): Promise<Response>;
}
