"use client";

import { ReactNode } from "react";

export interface Column<T> {
  header: string;
  align?: "left" | "center" | "right";
  render: (row: T) => ReactNode;
  width?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-glass-border bg-glass">
      <table className="w-full min-w-[720px] border-collapse text-xs">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className={`border-b border-border px-4 py-3 text-[10.5px] font-bold uppercase tracking-wide text-t3 ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                      ? "text-right"
                      : "text-left"
                }`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-border last:border-none transition-colors hover:bg-glass-hover ${
                onRowClick ? "cursor-pointer" : ""
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-4 py-3 align-middle text-t2 ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                        ? "text-right"
                        : "text-left"
                  }`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
