import Stripe from "stripe";
import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

interface Slot {
  from: string;
  to: string;
}

export class CreateStripeSession {
  private doctorRepo: DoctorRepository;
  private stripe: Stripe;

  constructor(doctorRepo: DoctorRepository, stripeInstance: Stripe) {
    this.doctorRepo = doctorRepo;
    this.stripe = stripeInstance;
  }

  async execute(
    doctorId: string,
    userId: string,
    slot: Slot,
    fee: number,
    date: string
  ): Promise<{ sessionId: string }> {
    const doctor = await this.doctorRepo.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const session = await this.stripe.checkout.sessions.create({
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
    },
  });

    return { sessionId: session.id };
  }
}
