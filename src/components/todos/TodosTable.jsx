import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export default function TodosTable({ data, columns, pageSize = 10 }) {
  const [sorting, setSorting] = useState([]);

  const memoData = useMemo(() => data ?? [], [data]);
  const memoColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const canSort = h.column.getCanSort();
                const sortDir = h.column.getIsSorted();
                return (
                  <th key={h.id} style={{ textAlign: "left" }}>
                    <button
                      type="button"
                      onClick={
                        canSort ? h.column.getToggleSortingHandler() : undefined
                      }
                      className={canSort ? "th-btn" : "th-btn"}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {sortDir === "asc"
                        ? " ▲"
                        : sortDir === "desc"
                          ? " ▼"
                          : ""}
                    </button>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 12,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span>
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            <strong>{table.getPageCount()}</strong>
          </span>
          <select
            className="btn btn-secondary"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
