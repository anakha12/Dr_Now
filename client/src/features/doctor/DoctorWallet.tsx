import { useEffect, useState } from "react";
import { getWalletSummary } from "../../services/doctorService";

interface Transaction {
  type: "credit" | "debit";
  amount: number;
  reason: string;
  date: string;
}

const ITEMS_PER_PAGE = 5;

const DoctorWallet = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchWalletData(currentPage);
  }, [currentPage]);

  const fetchWalletData = async (page: number) => {
    try {
      const data = await getWalletSummary(page, ITEMS_PER_PAGE);
      setWalletBalance(data.walletBalance);
      setTransactions(data.transactions);
      setTotalPages(Math.ceil(data.totalTransactions / ITEMS_PER_PAGE));
    } catch (err: any) {
      console.error(err.message);
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
              <th className="p-3">Reason</th>
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
              transactions.map((tx, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3 capitalize text-gray-700">{tx.type}</td>
                  <td
                    className={`p-3 font-medium ${
                      tx.type === "credit" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    ₹{tx.amount.toFixed(2)}
                  </td>
                  <td className="p-3 text-gray-600">{tx.reason}</td>
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
