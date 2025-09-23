import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNotifications } from "../../context/NotificationContext";

import {
  getWalletSummary,
  getPendingDoctors,
  payoutDoctor,
} from "../../services/adminService";
import { Messages } from "../../constants/messages";

const ITEMS_PER_PAGE = 5;

const DoctorPaymentPage = () => {
  const [walletSummary, setWalletSummary] = useState<{
    totalBalance: number;
    totalCommission: number;
    pendingDoctorPayouts: number;
  } | null>(null);

  const [pendingDoctors, setPendingDoctors] = useState<
    {
      doctorId: string;
      doctorName: string;
      totalPendingEarnings: number;
    }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addNotification, confirmMessage } = useNotifications();

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const [walletData, doctorsData] = await Promise.all([
        getWalletSummary(),
        getPendingDoctors(currentPage, ITEMS_PER_PAGE),
      ]);
      setWalletSummary(walletData);
      setPendingDoctors(doctorsData.doctors);
      setTotalPages(doctorsData.totalPages);
    } catch (error: any) {
      toast.error(error.message || Messages.DOCTOR.FETCH_WALLET_FAILED);
    }
  };

  const handlePayout = async (doctorId: string) => {
    const doctor = pendingDoctors.find((d) => d.doctorId === doctorId);
    const confirmed = await confirmMessage(
      `Are you sure you want to pay ₹${doctor?.totalPendingEarnings} to Dr. ${doctor?.doctorName}?`
    );
    if (!confirmed) {
      addNotification( Messages.DOCTOR.PAYOUT_CANCELLED, "INFO");
      return;
    }

    try {
      await payoutDoctor(doctorId);
      addNotification( Messages.DOCTOR.PAYOUT_SUCCESS, "SUCCESS");
      fetchData();
    } catch (error: any) {
      addNotification(error.message || Messages.DOCTOR.PAYOUT_FAILED, "ERROR");
    }
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-700">Doctor Payments</h2>
      </div>

      {/* Wallet Summary */}
      {walletSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-600">Total Balance</h2>
            <p className="text-xl font-bold text-teal-700">₹{walletSummary.totalBalance}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-600">Total Commission</h2>
            <p className="text-xl font-bold text-teal-700">₹{walletSummary.totalCommission}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-600">Pending Doctor Payouts</h2>
            <p className="text-xl font-bold text-orange-600">₹{walletSummary.pendingDoctorPayouts}</p>
          </div>
        </div>
      )}

      {/* Doctor List */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-teal-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Doctor</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Pending Amount</th>
              <th className="px-6 py-3 text-center font-medium text-teal-800">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingDoctors.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No pending payouts
                </td>
              </tr>
            ) : (
              pendingDoctors.map((doc) => (
                <tr key={doc.doctorId} className="border-b hover:bg-teal-50">
                  <td className="px-6 py-4">{doc.doctorName}</td>
                  <td className="px-6 py-4">₹{doc.totalPendingEarnings}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handlePayout(doc.doctorId)}
                      className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorPaymentPage;
