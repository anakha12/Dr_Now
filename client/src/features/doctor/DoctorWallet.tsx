import { useEffect, useState } from "react";
import { getWalletSummary } from "../../services/doctorService";
import type { WalletSummary } from "../../types/walletSummary";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";

const ITEMS_PER_PAGE = 5;

const DoctorWallet = () => {
  const [transactions, setTransactions] = useState<WalletSummary[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchWalletData(currentPage);
  }, [currentPage]);

  const fetchWalletData = async (page: number) => {
    try {
      const data: WalletSummary[] = await getWalletSummary(page, ITEMS_PER_PAGE);
      setTransactions(data);


      const balance = data.reduce((acc, tx) => {
        return tx.type === "credit" ? acc + tx.amount : acc - tx.amount;
      }, 0);
      setWalletBalance(balance);

      setTotalPages(1);
    } catch (err: any) {
      addNotification(Messages.DOCTOR.FETCH_WALLET_FAILED, "ERROR");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">Wallet Summary</h2>

      {/* Wallet Balance Card */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p className="text-lg font-medium text-gray-700">
          Wallet Balance:{" "}
          <span className="text-teal-600 font-semibold text-xl">
            ₹{walletBalance.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-teal-100 text-teal-700 font-semibold">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-t">
                  <td className="p-3 capitalize text-gray-700">{tx.type}</td>
                  <td
                    className={`p-3 font-medium ${
                      tx.type === "credit" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    ₹{tx.amount.toFixed(2)}
                  </td>
                  <td className="p-3 text-gray-600">{tx.description || "-"}</td>
                  <td className="p-3 text-gray-600">
                    {new Date(tx.date).toLocaleString()}
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
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorWallet;
