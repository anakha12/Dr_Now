// src/pages/Doctor/CurrentSchedules.tsx
import { useState, useEffect } from "react";
import {
  fetchDoctorAvailabilityRules,
  addDoctorAvailabilityRule,
  editDoctorAvailabilityRule,
  deleteDoctorAvailabilityRule,
  fetchDoctorAvailabilityExceptions,
  addDoctorAvailabilityException,
  deleteDoctorAvailabilityException,
  getAllDepartments,
} from "../../services/doctorService";
import { useNotifications } from "../../context/NotificationContext";
import type { AvailabilityRule } from "../../types/availabilityRule";
import type { AvailabilityException } from "../../types/availabilityException";
import type { Department } from "../../types/department";
import { Messages } from "../../constants/messages";

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const generateSlots = (rule: AvailabilityRule) => {
  const slots: string[] = [];
  const [sh, sm] = rule.startTime.split(":").map(Number);
  const [eh, em] = rule.endTime.split(":").map(Number);

  let current = new Date(1970, 0, 1, sh, sm);
  const end = new Date(1970, 0, 1, eh, em);

  while (current < end) {
    const next = new Date(current.getTime() + rule.slotDuration * 60000);
    if (next > end) break;
    slots.push(
      `${current.getHours().toString().padStart(2,"0")}:${current.getMinutes().toString().padStart(2,"0")} - ${next.getHours().toString().padStart(2,"0")}:${next.getMinutes().toString().padStart(2,"0")}`
    );
    current = next;
  }
  return slots;
};

const CurrentSchedules = () => {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const { addNotification, confirmMessage } = useNotifications();

  // --- Rule Modal ---
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AvailabilityRule | null>(null);
  const [ruleForm, setRuleForm] = useState<AvailabilityRule>({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
  });

  // --- Exception Modal ---
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionForm, setExceptionForm] = useState<Partial<Omit<AvailabilityException, "_id">>>({
    date: "",
    isAvailable: false,
    startTime: "",
    endTime: "",
    slotDuration: 30,
  });

  // --- Load data ---
  useEffect(() => {
    loadAvailabilityRules();
    loadAvailabilityExceptions();
    loadDepartments();
  }, []);

  const loadAvailabilityRules = async () => {
    try {
      const data = await fetchDoctorAvailabilityRules();
      setRules(data);
    } catch {
      addNotification(Messages.AVAILABILITY.FETCH_RULES_FAILED, "ERROR");
    }
  };

  const loadAvailabilityExceptions = async () => {
    try {
      const data = await fetchDoctorAvailabilityExceptions();
      setExceptions(data);
    } catch {
      addNotification(Messages.AVAILABILITY.FETCH_EXCEPTIONS_FAILED, "ERROR");
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data);
    } catch {
      addNotification(Messages.AVAILABILITY.FETCH_DEPARTMENTS_FAILED, "ERROR");
    }
  };

  // --- Handlers ---
  const handleSaveRule = async () => {
    try {
      if (editingRule) {
        await editDoctorAvailabilityRule(editingRule.dayOfWeek, {
          startTime: ruleForm.startTime,
          endTime: ruleForm.endTime,
          slotDuration: ruleForm.slotDuration,
        });
        addNotification(Messages.AVAILABILITY.UPDATE_RULE_SUCCESS, "SUCCESS");
      } else {
        await addDoctorAvailabilityRule(ruleForm);
        addNotification(Messages.AVAILABILITY.ADD_RULE_SUCCESS, "SUCCESS");
      }
      setShowRuleModal(false);
      setEditingRule(null);
      loadAvailabilityRules();
    } catch {
      addNotification(editingRule ? Messages.AVAILABILITY.UPDATE_RULE_FAILED : Messages.AVAILABILITY.ADD_RULE_FAILED, "ERROR");
    }
  };

  const handleEditRule = (rule: AvailabilityRule) => {
    setEditingRule(rule);
    setRuleForm(rule);
    setShowRuleModal(true);
  };

  const handleRemoveRule = async (rule: AvailabilityRule) => {
    const confirmed = await confirmMessage(
      Messages.AVAILABILITY.CONFIRM_DELETE_RULE(days[rule.dayOfWeek], rule.startTime, rule.endTime, rule.slotDuration)
    );
    if (!confirmed) return;

    try {
      await deleteDoctorAvailabilityRule(rule.dayOfWeek);
      addNotification(Messages.AVAILABILITY.DELETE_RULE_SUCCESS, "SUCCESS");
      loadAvailabilityRules();
    } catch {
      addNotification(Messages.AVAILABILITY.DELETE_RULE_FAILED, "ERROR");
    }
  };

  const handleAddException = async () => {
    try {
      const newException = await addDoctorAvailabilityException(exceptionForm);
      setExceptions((prev) => [...prev, newException]);
      addNotification(Messages.AVAILABILITY.ADD_EXCEPTION_SUCCESS, "SUCCESS");
      setShowExceptionModal(false);
    } catch {
      addNotification(Messages.AVAILABILITY.ADD_EXCEPTION_FAILED, "ERROR");
    }
  };

  const handleDeleteException = async (id: string) => {
    const confirmed = await confirmMessage(Messages.AVAILABILITY.CONFIRM_DELETE_EXCEPTION);
    if (!confirmed) return;

    try {
      await deleteDoctorAvailabilityException(id);
      setExceptions((prev) => prev.filter((ex) => ex._id !== id));
      addNotification(Messages.AVAILABILITY.DELETE_EXCEPTION_SUCCESS, "SUCCESS");
    } catch {
      addNotification(Messages.AVAILABILITY.DELETE_EXCEPTION_FAILED, "ERROR");
    }
  };

  const activeRule = rules.find((r) => r.dayOfWeek === activeDay);
  const slots = activeRule ? generateSlots(activeRule) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">Doctor Availability Schedule</h1>

      {/* Day Tabs */}
      <div className="flex gap-3 mb-8">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDay(idx)}
            className={`px-4 py-2 rounded-lg font-semibold shadow-sm ${
              activeDay === idx ? "bg-teal-500 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {day}
          </button>
        ))}
        <button
          onClick={() => {
            setEditingRule(null);
            setRuleForm({
              dayOfWeek: 1,
              startTime: "09:00",
              endTime: "17:00",
              slotDuration: 30,
            });
            setShowRuleModal(true);
          }}
          className="ml-auto bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
        >
          Add Rule
        </button>
        <button onClick={() => setShowExceptionModal(true)} className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
          Add Exception
        </button>
      </div>

      {/* Slots for Active Day */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        {activeRule ? (
          <>
            <h2 className="text-xl font-bold text-teal-700 mb-4">{days[activeRule.dayOfWeek]} Slots</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map((slot, idx) => (
                <div key={idx} className="px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 text-sm font-medium text-center">{slot}</div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleEditRule(activeRule)}
                className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
              >
                Edit Rule
              </button>
              <button
                onClick={() => handleRemoveRule(activeRule)}
                className="text-red-500 hover:text-red-700 font-semibold text-sm"
              >
                Delete Rule
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">No availability set for {days[activeDay]}.</p>
        )}
      </div>

      {/* Exceptions Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-teal-700 mb-4">Availability Exceptions</h2>
        <ul className="space-y-2 mb-4">
          {exceptions.map((ex) => {
            const slots =
              ex.isAvailable && ex.startTime && ex.endTime && ex.slotDuration
                ? generateSlots({
                    startTime: ex.startTime,
                    endTime: ex.endTime,
                    slotDuration: ex.slotDuration,
                    dayOfWeek: new Date(ex.date).getDay(),
                  })
                : [];

            return (
              <li
                key={ex._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border p-2 rounded"
              >
                <div>
                  <p className="font-medium">
                    {ex.date} — {ex.isAvailable ? "Available" : "Not Available"}
                  </p>
                  {slots.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                      {slots.map((slot, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-teal-50 border border-teal-200 rounded text-teal-700 text-xs text-center"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() =>{ ex._id && handleDeleteException(ex._id)}}
                  className="text-red-500 hover:text-red-700 font-semibold text-sm mt-2 sm:mt-0"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-700">
                {editingRule ? "Edit Availability Rule" : "Add Availability Rule"}
              </h2>
              <button
                onClick={() => { setShowRuleModal(false); setEditingRule(null); }}
                className="text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Day of Week</label>
                <select
                  className="border p-2 rounded"
                  value={ruleForm.dayOfWeek}
                  disabled={!!editingRule}
                  onChange={(e) => setRuleForm({ ...ruleForm, dayOfWeek: Number(e.target.value) })}
                >
                  {days.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col flex-1">
                  <label className="text-gray-700 font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={ruleForm.startTime}
                    onChange={(e) => setRuleForm({ ...ruleForm, startTime: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-gray-700 font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={ruleForm.endTime}
                    onChange={(e) => setRuleForm({ ...ruleForm, endTime: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Slot Duration (minutes)</label>
                <input
                  type="number"
                  value={ruleForm.slotDuration}
                  onChange={(e) => setRuleForm({ ...ruleForm, slotDuration: Number(e.target.value) })}
                  className="border p-2 rounded w-32"
                />
              </div>
              <button
                onClick={handleSaveRule}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 mt-2"
              >
                {editingRule ? "Update Rule" : "Add Rule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exception Modal */}
      {showExceptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-700">Add Availability Exception</h2>
              <button onClick={() => setShowExceptionModal(false)} className="text-gray-500 hover:text-gray-700 font-bold text-xl">×</button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={exceptionForm.date || ""}
                  onChange={(e) => setExceptionForm({ ...exceptionForm, date: e.target.value })}
                  className="border p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Availability</label>
                <select
                  value={exceptionForm.isAvailable ? "yes" : "no"}
                  onChange={(e) =>
                    setExceptionForm({ ...exceptionForm, isAvailable: e.target.value === "yes" })
                  }
                  className="border p-2 rounded"
                >
                  <option value="no">Not Available</option>
                  <option value="yes">Available</option>
                </select>
              </div>
              {exceptionForm.isAvailable && (
                <>
                  <div className="flex gap-3">
                    <div className="flex flex-col flex-1">
                      <label className="text-gray-700 font-medium mb-1">Start Time</label>
                      <input
                        type="time"
                        value={exceptionForm.startTime || ""}
                        onChange={(e) => setExceptionForm({ ...exceptionForm, startTime: e.target.value })}
                        className="border p-2 rounded"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <label className="text-gray-700 font-medium mb-1">End Time</label>
                      <input
                        type="time"
                        value={exceptionForm.endTime || ""}
                        onChange={(e) => setExceptionForm({ ...exceptionForm, endTime: e.target.value })}
                        className="border p-2 rounded"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-1">Slot Duration (minutes)</label>
                    <input
                      type="number"
                      value={exceptionForm.slotDuration || 30}
                      onChange={(e) => setExceptionForm({ ...exceptionForm, slotDuration: Number(e.target.value) })}
                      className="border p-2 rounded w-32"
                    />
                  </div>
                </>
              )}
              <button
                onClick={handleAddException}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 mt-2"
              >
                Add Exception
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentSchedules;
