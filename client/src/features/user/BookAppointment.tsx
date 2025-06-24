import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoctorById, createStripeSession, getBookedSlots,getUserProfile } from "../../services/userService";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface Slot {
  from: string;
  to: string;
}

interface Availability {
  date: string;
  slots: Slot[];
}

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  consultFee: number;
  profileImage: string;
  gender: string;
  isVerified: boolean;
  availability?: Availability[];
}

const BookAppointment = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        if (!id) return;
        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (error) {
        toast.error("Failed to load doctor data");
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate || !doctor?._id) return;

      try {
        const data = await getBookedSlots(doctor._id, selectedDate);
        setBookedSlots(data);
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, doctor?._id]);

  const handleBook = async () => {
    console.log('handile book is clicked ')
    if (!selectedDate || !selectedSlot || !doctor) {
      console.log("Missing input:", { selectedDate, selectedSlot, doctor });
      return toast.error("Please select date and slot");
    }

    try {
      
      const user = await getUserProfile(); 
      const userId = user.id || user.userId;
      const { sessionId } = await createStripeSession(
        doctor._id,
        userId,
        selectedSlot,
        doctor.consultFee,
        selectedDate
      );
      console.log("Stripe session ID:", sessionId);
      const stripe = await stripePromise;
      console.log(stripe);
      
      if (!stripe) return toast.error("Stripe initialization failed");

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error("Something went wrong while booking");
    }
  };


  const getSlotsForDate = (date: string): Slot[] => {
    const dayAvailability = doctor?.availability?.find((a) => a.date === date);
    if (!dayAvailability) return [];
    return dayAvailability.slots.filter(
      (slot) =>
        !bookedSlots.some(
          (booked) => booked.from === slot.from && booked.to === slot.to
        )
    );
  };

  const availableDates = doctor?.availability?.map((a) => a.date) || [];

  if (!doctor) {
    return (
      <div className="text-center py-20 text-lg text-teal-600">
        Loading doctor information...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Book Appointment
      </h2>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-teal-100">
        <div className="flex items-center gap-4">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${doctor.profileImage}`}
            alt={doctor.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-teal-500"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Dr. {doctor.name}
            </h3>
            <p className="text-sm text-teal-600">{doctor.specialization}</p>
            <p className="text-sm text-gray-500">₹{doctor.consultFee} Fee</p>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Select Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
            }}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Select Date --</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Available Slots
            </label>
            <div className="flex flex-wrap gap-2">
              {/* Option A: Hide Booked Slots */}
              {/* getSlotsForDate(selectedDate).map(...) */}
              {/* Uncomment below if you want to SHOW but DISABLE booked slots instead: */}

              {doctor?.availability
                ?.find((a) => a.date === selectedDate)
                ?.slots.map((slot, index) => {
                  const label = `${slot.from} - ${slot.to}`;
                  const isSelected =
                    selectedSlot?.from === slot.from &&
                    selectedSlot?.to === slot.to;
                  const isBooked = bookedSlots.some(
                    (booked) =>
                      booked.from === slot.from && booked.to === slot.to
                  );

                  return (
                    <button
                      key={index}
                      onClick={() => !isBooked && setSelectedSlot(slot)}
                      disabled={isBooked}
                      className={`px-4 py-2 rounded border ${
                        isBooked
                          ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-teal-600 text-white border-teal-700"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-teal-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}

              {/* Show message if all are booked */}
              {getSlotsForDate(selectedDate).length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No slots available for this date.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleBook}
          className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;
