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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const canSort = h.column.getCanSort();
                const sortDir = h.column.getIsSorted();
                return (
                  <th
                    key={h.id}
                    className="border-b border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-slate-700"
                  >
                    <button
                      type="button"
                      onClick={
                        canSort ? h.column.getToggleSortingHandler() : undefined
                      }
                      className="flex w-full items-center justify-between gap-2 bg-transparent text-left"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      <span className="text-slate-400">
                        {sortDir === "asc"
                          ? "▲"
                          : sortDir === "desc"
                            ? "▼"
                            : ""}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-indigo-50/40">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b border-slate-100 px-3 py-3 text-sm text-slate-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-3 p-3">
        <div className="flex gap-2">
          <button
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 active:translate-y-px disabled:opacity-60"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 active:translate-y-px disabled:opacity-60"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-700">
            Page{" "}
            <span className="font-extrabold">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className="font-extrabold">{table.getPageCount()}</span>
          </span>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200"
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
