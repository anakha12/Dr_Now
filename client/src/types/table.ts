import React from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface TableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  rowKey?: keyof T;
  emptyMessage?: string;
  onViewDetails?: (id: string) => void;
}
