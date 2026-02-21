import { Request, Response } from "express";
import { ISendMessageUseCase } from "../../application/use_cases/interfaces/chat/ISendMessageUseCase";
import { HttpStatus } from "../../utils/HttpStatus";
import { handleControllerError } from "../../utils/errorHandler";

export class ChatController {

  constructor(
    private _sendMessageUseCase: ISendMessageUseCase
  ) {}

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {

      const response = await this._sendMessageUseCase.execute(req.body);

      res.status(HttpStatus.CREATED).json({
        success: true,
        data: response,
      });

    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }
  }
}
