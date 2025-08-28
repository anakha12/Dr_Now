import React from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode); 
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  onViewDetails?: (id: string) => void; // ✅ new prop
}

function Table<T extends { id: string }>({
  data,
  columns,
  emptyMessage = "No records found",
  onViewDetails,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-teal-100">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-6 py-3 text-left font-medium text-teal-800 ${
                  col.className ?? ""
                }`}
              >
                {col.header}
              </th>
            ))}

            {/* ✅ Always show "View" column if onViewDetails is provided */}
            {onViewDetails && (
              <th className="px-6 py-3 text-left font-medium text-teal-800">
                View
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onViewDetails ? 1 : 0)}
                className="text-center p-6 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-b hover:bg-teal-50">
                {columns.map((col, i) => {
                  const value =
                    typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode);

                  return (
                    <td
                      key={i}
                      className={`px-6 py-4 ${col.className ?? ""}`}
                    >
                      {value}
                    </td>
                  );
                })}

                {/* ✅ Render "View Details" button */}
                {onViewDetails && (
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewDetails(row.id)}
                      className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white font-medium shadow"
                    >
                      View Details
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
