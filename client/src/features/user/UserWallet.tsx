import { useEffect, useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { getUserWallet } from "../../services/userService";
import type { Transaction } from "../../types/transaction";
import { Messages } from "../../constants/messages";

const ITEMS_PER_PAGE = 3;

const UserWallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { addNotification } = useNotifications();

  const totalPages = Math.ceil(totalTransactions / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await getUserWallet(currentPage, ITEMS_PER_PAGE);
        setBalance(data.walletBalance);
        setTransactions(data.walletTransactions || []);
        setTotalTransactions(data.totalTransactions || 0);
      } catch (err) {
        addNotification(Messages.WALLET.FETCH_FAILED, "ERROR");
      }
    };

    fetchWallet();
  }, [currentPage, addNotification]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-cyan-100 to-blue-200">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-teal-800 mb-6">My Wallet</h1>
        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-600">Available Balance</p>
          <p className="text-4xl font-bold text-green-700">₹{balance}</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions yet.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {transactions.map((tx, index) => (
                <li
                  key={index}
                  className={`p-5 rounded-xl shadow-sm transition-transform transform hover:scale-[1.02] border-l-4 ${
                    tx.type === "credit" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        tx.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold">
                      {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{tx.reason}</p>
                  {tx.bookingId && (
                    <p className="text-xs text-gray-500 mt-1">Booking: {tx.bookingId}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(tx.date).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded-full text-sm hover:bg-gray-300 disabled:opacity-50 transition"
                >
                  Previous
                </button>
                <span className="text-gray-600 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-full text-sm hover:bg-gray-300 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserWallet;
