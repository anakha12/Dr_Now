import { useEffect, useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { getUserWallet } from "../../services/userService";

interface Transaction {
  type: "credit" | "debit";
  amount: number;
  reason: string;
  bookingId?: string;
  date: string;
}

const ITEMS_PER_PAGE = 3;

const UserWallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { addNotification } = useNotifications();

  const totalPages = Math.ceil(allTransactions.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await getUserWallet();
        setBalance(data.walletBalance);
        setAllTransactions(data.walletTransactions || []);
      } catch (err) {
        addNotification("Failed to load wallet info", "error");
      }
    };

    fetchWallet();
  }, [addNotification]);

  const paginatedTransactions = allTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-700 mb-4">Wallet</h1>
      <p className="text-xl font-semibold mb-6">Balance: ₹{balance}</p>

      <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
      {paginatedTransactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {paginatedTransactions.map((tx, index) => (
              <li
                key={index}
                className={`p-4 rounded shadow ${
                  tx.type === "credit" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <p className="font-semibold">
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                </p>
                <p className="text-sm">{tx.reason}</p>
                {tx.bookingId && (
                  <p className="text-xs text-gray-500">Booking: {tx.bookingId}</p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(tx.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {/* Pagination Controls */}
          {allTransactions.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default UserWallet;
