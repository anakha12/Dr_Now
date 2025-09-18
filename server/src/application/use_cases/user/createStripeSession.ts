import Stripe from "stripe";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { ICreateStripeSession } from "../interfaces/user/ICreateStripeSession";
import { ErrorMessages } from "../../../utils/Messages";

interface Slot {
  from: string;
  to: string;
}

export class CreateStripeSession implements ICreateStripeSession{
  private _doctorRepo:IDoctorRepository;
  private _stripe: Stripe;

  constructor(doctorRepo: IDoctorRepository, stripeInstance: Stripe) {
    this._doctorRepo = doctorRepo;
    this._stripe = stripeInstance;
  }

  async execute(
    doctorId: string,
    userId: string,
    slot: Slot,
    fee: number,
    date: string
  ): Promise<{ sessionId: string }> {
    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) throw new Error( ErrorMessages.DOCTOR_NOT_FOUND);

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
    success_url: `${process.env.CLIENT_URL}/user/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: {
      doctorId,
      userId, 
      date,
      slotFrom: slot.from,
      slotTo: slot.to,
      fee: fee.toString()
    },
  });

    return { sessionId: session.id };
  }
}
