import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import {
  fetchDoctorAvailability,
  addDoctorSchedule,
  deleteDoctorSlot,
  editDoctorSchedule,
} from "../../services/doctorService";

import { useNotifications } from "../../context/NotificationContext";

interface Slot {
  from: string;
  to: string;
}

interface Availability {
  date: string;
  slots: Slot[];
}

interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
}

const CurrentSchedules = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{ date: string; slot: Slot } | null>(null);

  const { addNotification, confirmMessage } = useNotifications();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setDoctorId(decoded.userId);
      } catch {
        addNotification("Session expired or invalid token", "error");
      }
    }
  }, []);

  useEffect(() => {
    if (doctorId) loadAvailability();
  }, [doctorId]);

  const loadAvailability = async () => {
    try {
      const data = await fetchDoctorAvailability(doctorId!);
      setAvailability(data);
    } catch {
      addNotification("Failed to load doctor schedules", "error");
    }
  };

  const handleAddTime = async () => {
    if (!date || !from || !to) {
      addNotification("Attempted to add empty schedule", "warning");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      addNotification("Attempted to select a past date", "error");
      return;
    }

    const fromTime = new Date(`1970-01-01T${from}:00`);
    const toTime = new Date(`1970-01-01T${to}:00`);
    if (fromTime >= toTime) {
      addNotification("Invalid time range in schedule", "error");
      return;
    }

    try {
      if (!doctorId) {
        addNotification("Doctor ID was missing", "error");
        return;
      }

      if (isEditing && editingSlot) {
        await deleteDoctorSlot(doctorId, editingSlot.date, editingSlot.slot);
        await editDoctorSchedule(doctorId, {
          date,
          from,
          to,
          oldDate: editingSlot.date,
          oldFrom: editingSlot.slot.from,
          oldTo: editingSlot.slot.to,
        });

        addNotification("Schedule updated successfully", "success");
      } else {
        await addDoctorSchedule(doctorId, { date, from, to });
        addNotification(`Schedule added: ${from}–${to} on ${date}`, "success");
      }

      setShowModal(false);
      setDate("");
      setFrom("");
      setTo("");
      setIsEditing(false);
      setEditingSlot(null);
      loadAvailability();
    } catch {
      addNotification("Failed to process schedule update", "error");
    }
  };

  const handleRemoveSlot = async (day: string, slot: Slot) => {
    const { from, to } = slot;

    const confirmed = await confirmMessage(`Are you sure you want to delete the slot ${from}–${to} on ${day}?`);

    if (!confirmed) {
      addNotification("Slot deletion cancelled", "info");
      return;
    }

    try {
      if (!doctorId) {
        addNotification("Missing doctor ID during slot removal", "error");
        return;
      }

      await deleteDoctorSlot(doctorId, day, slot);
      addNotification(`Slot removed: ${from}–${to} on ${day}`, "success");
      loadAvailability();
    } catch (err: any) {
      const errorMessage =
        err?.error ||
        err?.response?.data?.error ||
        err?.message ||
        `Failed to remove slot ${from}–${to} on ${day}`;

      addNotification(errorMessage, "error");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-700">Current Schedules</h2>
        <button
          onClick={() => {
            setDate("");
            setFrom("");
            setTo("");
            setIsEditing(false);
            setEditingSlot(null);
            setShowModal(true);
          }}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
        >
          + Add Schedule
        </button>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-white/10 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-lg w-[90%] max-w-md">
              <h3 className="text-xl font-semibold text-teal-700 text-center mb-4">
                {isEditing ? "Edit Schedule" : "Add Availability"}
              </h3>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-teal-200 p-2 rounded-lg mb-4 focus:outline-teal-400"
                min={new Date().toISOString().split("T")[0]}
              />
              <div className="flex gap-2 mb-4">
                <input
                  type="time"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-1/2 border border-teal-200 p-2 rounded-lg focus:outline-teal-400"
                />
                <input
                  type="time"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-1/2 border border-teal-200 p-2 rounded-lg focus:outline-teal-400"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleAddTime}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold shadow"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-teal-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availability.map((day) => (
          <div key={day.date} className="bg-white rounded-xl p-4 shadow border border-teal-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-teal-700">
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={() => {
                  setDate(day.date);
                  setFrom(day.slots[0].from);
                  setTo(day.slots[day.slots.length - 1].to);
                  setIsEditing(true);
                  setEditingSlot({ date: day.date, slot: day.slots[0] });
                  setShowModal(true);
                }}
                className="text-xs text-yellow-500 hover:text-yellow-600"
              >
                ✎ Edit Day
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {day.slots.map((slot, i) => (
                <div
                  key={i}
                  className="bg-teal-50 text-teal-800 border border-teal-300 rounded-lg px-3 py-1 text-sm flex justify-between items-center shadow-sm"
                >
                  <span>{slot.from} – {slot.to}</span>
                  <button
                    onClick={() => handleRemoveSlot(day.date, slot)}
                    className="text-teal-600 hover:text-red-500 text-xs"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentSchedules;
