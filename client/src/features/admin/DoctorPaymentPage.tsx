import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useNotifications } from "../../hooks/useNotifications";
import { Wallet, Landmark, Clock, IndianRupee } from "lucide-react";

import {
  getWalletSummary,
  getPendingDoctors,
  payoutDoctor,
} from "../../services/adminService";
import { Messages } from "../../constants/messages";
import { handleError } from "../../utils/errorHandler"; 

interface WalletSummary {
  totalBalance: number;
  totalCommission: number;
  pendingDoctorPayouts: number;
}

interface PendingDoctor {
  doctorId: string;
  doctorName: string;
  totalPendingAmount: number;
}

interface PendingDoctorsResponse {
  doctors: PendingDoctor[];
  totalPages: number;
}

const ITEMS_PER_PAGE = 5;

const DoctorPaymentPage = () => {
  const [walletSummary, setWalletSummary] = useState<WalletSummary | null>(null);
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addNotification, confirmMessage } = useNotifications();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletData, doctorsData]: [WalletSummary, PendingDoctorsResponse] =
        await Promise.all([
          getWalletSummary(),
          getPendingDoctors(currentPage, ITEMS_PER_PAGE),
        ]);

      setWalletSummary(walletData);
      setPendingDoctors(doctorsData.doctors);
      setTotalPages(doctorsData.totalPages);
    } catch (error: unknown) {
      const err = handleError(error, Messages.DOCTOR.FETCH_WALLET_FAILED);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
 }, [currentPage]);

   useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePayout = async (doctorId: string) => {
    const doctor = pendingDoctors.find((d) => d.doctorId === doctorId);
    if (!doctor) return;

    const confirmed = await confirmMessage(
      `Are you sure you want to pay ₹${doctor.totalPendingAmount} to Dr. ${doctor.doctorName}?`
    );

    if (!confirmed) {
      addNotification(Messages.DOCTOR.PAYOUT_CANCELLED, "INFO");
      return;
    }

    try {
      await payoutDoctor(doctorId);
      addNotification(Messages.DOCTOR.PAYOUT_SUCCESS, "SUCCESS");
      fetchData();
    } catch (error: unknown) {
      const err = handleError(error, Messages.DOCTOR.PAYOUT_FAILED);
      addNotification(err.message, "ERROR");
    }
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Doctor Payments</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage platform revenue and process pending payouts.</p>
        </div>
        <div className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-100 flex items-center gap-2 text-sm font-medium">
          <IndianRupee className="w-4 h-4" />
          Finance Overview
        </div>
      </div>

      {/* Wallet Summary */}
      {walletSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-slate-800">
                ₹{Math.round(walletSummary.totalBalance).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Commission</p>
              <p className="text-2xl font-bold text-slate-800">
                ₹{Math.round(walletSummary.totalCommission).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending Payouts</p>
              <p className="text-2xl font-bold text-slate-800">
               ₹{Math.round(walletSummary.pendingDoctorPayouts).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Doctor List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className={`transition-opacity duration-200 overflow-x-auto ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-500 text-sm">
                    Loading payouts...
                  </td>
                </tr>
              ) : pendingDoctors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-500 text-sm bg-slate-50/50">
                    No pending payouts
                  </td>
                </tr>
              ) : (
                pendingDoctors.map((doc) => (
                  <tr key={doc.doctorId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-800">{doc.doctorName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-700">₹{doc.totalPendingAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handlePayout(doc.doctorId)}
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded-md text-xs font-semibold bg-white border border-teal-300 text-teal-700 hover:bg-teal-50 transition-colors"
                      >
                        Process Payout
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPaymentPage;
