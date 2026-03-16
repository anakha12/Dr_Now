import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoctorBookingDetails,
  addPrescriptionToBooking,
  getDoctorProfile,
} from "../../services/doctorService";
import { useNotifications } from "../../hooks/useNotifications";
import type { Booking, Prescription } from "../../types/booking";
import { prescriptionSchema } from "../../validation/prescriptionSchema"

/* ---------------- COMPONENT ---------------- */

const DoctorPrescription = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [doctorName, setDoctorName] = useState("");

  const [medicines, setMedicines] = useState<
    {
      name: string;
      dose: string;
      frequency: string;
      duration: string;
      notes?: string;
    }[]
  >([{ name: "", dose: "", frequency: "", duration: "", notes: "" }]);

  const [notes, setNotes] = useState("");

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    if (!bookingId) return;

    const fetchData = async () => {
      try {
        const bookingRes = await getDoctorBookingDetails(bookingId);
        setBooking(bookingRes);

        const doctorRes = await getDoctorProfile();
        setDoctorName(doctorRes.name);
      } catch (err) {
        console.error(err);
        addNotification("Failed to fetch booking or doctor details", "ERROR");
      }
    };

    fetchData();
  }, [bookingId,addNotification]);

  /* ---------------- MEDICINE HANDLERS ---------------- */
  type Medicine = Prescription["medicines"][number];
  const handleMedicineChange = (
    index: number,
    field: keyof Medicine,
    value: string
  ) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: "", dose: "", frequency: "", duration: "", notes: "" },
    ]);
  };

  const removeMedicineRow = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!bookingId) return;

    try {
     
      const filteredMedicines = medicines.filter(
        (med) =>
          med.name.trim() ||
          med.dose.trim() ||
          med.frequency.trim() ||
          med.duration.trim()
      );

      const result  = prescriptionSchema.safeParse({
        doctorName,
        medicines: filteredMedicines,
        notes,
      });

      if (!result.success) {
      
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".") || "Field";
        addNotification(`${path}: ${issue.message}`, "ERROR");
      });
      return;
    }
      const prescription: Prescription = {
        doctorName,
        date: new Date().toISOString(),
        medicines: filteredMedicines,
        notes,
      };

      await addPrescriptionToBooking(bookingId, prescription);

      addNotification("Prescription saved successfully", "SUCCESS");

      navigate("/doctor/appointments");
    } catch (err) {
      console.error(err);
      addNotification("Failed to save prescription", "ERROR");
    }
  };

  /* ---------------- LOADING ---------------- */

  if (!booking)
    return <p className="p-4 text-center">Loading booking details...</p>;

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-teal-700">
        Add Prescription
      </h2>

      {/* Patient */}
      <div className="mb-4">
        <label className="block font-semibold">Patient</label>
        <input
          value={booking.patientName}
          readOnly
          className="border p-2 w-full"
        />
      </div>

      {/* Doctor */}
      <div className="mb-4">
        <label className="block font-semibold">Doctor Name</label>
        <input value={doctorName} readOnly className="border p-2 w-full" />
      </div>

      {/* Date */}
      <div className="mb-4">
        <label className="block font-semibold">Date</label>
        <input
          value={new Date().toLocaleDateString()}
          readOnly
          className="border p-2 w-full"
        />
      </div>

      {/* Medicines */}
      <div className="mb-4">
        <label className="block font-semibold">Medicines</label>

        {medicines.map((med, index) => (
          <div key={index} className="flex gap-2 mb-2 flex-wrap">
            <input
              placeholder="Name"
              value={med.name}
              onChange={(e) =>
                handleMedicineChange(index, "name", e.target.value)
              }
              className="border p-2 flex-1 min-w-[120px]"
            />

            <input
              placeholder="Dose"
              value={med.dose}
              onChange={(e) =>
                handleMedicineChange(index, "dose", e.target.value)
              }
              className="border p-2 flex-1 min-w-[120px]"
            />

            <input
              placeholder="Frequency"
              value={med.frequency}
              onChange={(e) =>
                handleMedicineChange(index, "frequency", e.target.value)
              }
              className="border p-2 flex-1 min-w-[120px]"
            />

            <input
              placeholder="Duration"
              value={med.duration}
              onChange={(e) =>
                handleMedicineChange(index, "duration", e.target.value)
              }
              className="border p-2 flex-1 min-w-[120px]"
            />

            <input
              placeholder="Notes"
              value={med.notes}
              onChange={(e) =>
                handleMedicineChange(index, "notes", e.target.value)
              }
              className="border p-2 flex-1 min-w-[120px]"
            />

            <button
              onClick={() => removeMedicineRow(index)}
              className="bg-rose-500 text-white px-2 rounded"
            >
              X
            </button>
          </div>
        ))}

        <button
          onClick={addMedicineRow}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2"
        >
          + Add Medicine
        </button>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block font-semibold">Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-teal-600 text-white px-4 py-2 rounded"
      >
        Save Prescription
      </button>
    </div>
  );
};

export default DoctorPrescription;