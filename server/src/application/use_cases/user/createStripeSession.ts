import Stripe from "stripe";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { ICreateStripeSession } from "../interfaces/user/ICreateStripeSession";
import { ErrorMessages } from "../../../utils/Messages";
import { BaseUseCase } from "../base-usecase";
import { CreateStripeSessionRequestDTO } from "../../../interfaces/dto/request/create-stripe-session.request.dto";
import { CreateStripeSessionResponseDTO } from "../../../interfaces/dto/response/user/create-stripe-session.response.dto";
import { plainToInstance } from "class-transformer";

export class CreateStripeSession extends BaseUseCase<
  CreateStripeSessionRequestDTO,
  CreateStripeSessionResponseDTO
> implements ICreateStripeSession {
  constructor(
    private readonly _doctorRepo: IDoctorRepository,
    private readonly _stripe: Stripe
  ) {
    super();
  }

  async execute(
    input: CreateStripeSessionRequestDTO
  ): Promise<CreateStripeSessionResponseDTO> {

    const dto = await this.validateDto(CreateStripeSessionRequestDTO, input);
    const { doctorId, userId, slot, fee, date } = dto;

    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) throw new Error(ErrorMessages.DOCTOR_NOT_FOUND);

    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Consultation with Dr. ${doctor.name}`,
            },
            unit_amount: fee * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/user/success?userId=${userId}&doctorName=${encodeURIComponent(
        doctor.name
      )}&date=${date}&slotFrom=${slot.from}&slotTo=${slot.to}&fee=${fee}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        doctorId,
        userId,
        date,
        slotFrom: slot.from,
        slotTo: slot.to,
        fee: fee.toString(),
      },
    });


    const response = plainToInstance(CreateStripeSessionResponseDTO, {
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });

    return response;
  }
}
