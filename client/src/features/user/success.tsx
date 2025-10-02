import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { useDispatch } from "react-redux";
import { setUserAuth } from "../../redux/slices/authSlice";
import { getUserProfile } from "../../services/userService";
import { Messages, NotificationDefaults } from "../../constants/messages";
import  log from "../../utils/logger";
import type { AppointmentData } from "../../types/appointmentData";


const Success = () => {
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [searchParams] = useSearchParams();
  const notifiedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!notifiedRef.current) {
        const userId = searchParams.get("userId");
        const doctorName = searchParams.get("doctorName");
        const date = searchParams.get("date");
        const slotFrom = searchParams.get("slotFrom");
        const slotTo = searchParams.get("slotTo");
        const fee = searchParams.get("fee");

        setAppointmentData({ userId, doctorName, date, slotFrom, slotTo, fee });
        setLoading(false);

        // Notify success
        addNotification(Messages.DOCTOR.APPOINTMENTS.BOOKING_SUCCESS, "SUCCESS");
        notifiedRef.current = true;

        try {
 
          const user = await getUserProfile();
          dispatch(setUserAuth({ isAuthenticated: true, user }));
        } catch (err) {
          log.error(Messages.USER.FETCH_FAILED_USER_AFTER_BOOK, err);
        }
      }
    };

    fetchData();
  }, [searchParams, addNotification, dispatch]);

  if (loading) return <div className="text-center py-20">{NotificationDefaults.INFO}</div>;

  if (!appointmentData)
    return <div className="text-center py-20">{Messages.DOCTOR.APPOINTMENTS.NO_BOOKINGS}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow-md text-center max-w-md mb-4">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          {Messages.DOCTOR.APPOINTMENTS.BOOKING_SUCCESS}
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>Doctor:</strong> Dr. {appointmentData.doctorName}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Date:</strong> {appointmentData.date}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Time:</strong> {appointmentData.slotFrom} - {appointmentData.slotTo}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Amount Paid:</strong> ₹{appointmentData.fee}
        </p>
      </div>

      <button
        onClick={() => navigate("/user/online-consultation")}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        {Messages.DOCTOR.BOOKING_DETAILS.BACK_BUTTON}
      </button>
    </div>
  );
};

export default Success;
