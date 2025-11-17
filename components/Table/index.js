"use client";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconAngleDown,
  IconAngleUp,
  IconArrowLeft,
  IconArrowRight,
} from "../Icons";

function Table({ columns: columnsData, data: tableData }) {
  const columns = useMemo(() => columnsData, [columnsData]);

  const data = useMemo(() => tableData, [tableData]);

  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      size: "auto",
      // minSize: 200,
    },
    initialState: {
      pagination: {
        pageSize: 300,
      },
    },
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-8">
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="w-full table-auto">
          <thead className="border-b-2 border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        width: header.column.getSize() || "auto",
                      }} // auto could change
                      className={`px-4 py-3 text-sm capitalize text-left align-middle font-medium`}
                    >
                      {header.isPlaceholder ? null : (
                        <span
                          onClick={
                            table.getRowModel().rows?.length
                              ? header.column.getToggleSortingHandler()
                              : null
                          }
                          className={`select-none flex items-center gap-1 ${
                            header.column.getCanSort() &&
                            table.getRowModel().rows?.length
                              ? "cursor-pointer"
                              : "cursor-default"
                          }`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{ asc: <IconAngleUp />, desc: <IconAngleDown /> }[
                            table.getRowModel().rows?.length &&
                              header.column.getIsSorted()
                          ] ?? null}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      // style={{
                      //   width: cell.column.getSize(),
                      // }}
                      className="align-middle px-4 py-3 text-sm border-collapse border border-x-0 border-y-gray-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-3 text-center align-middle"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="mt-5 flex justify-center items-center gap-3">
          {/* <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded-md text-xs bg-gray-300 disabled:opacity-50"
          >
            First
          </button> */}

          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-gray-500 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
          >
            <IconArrowLeft />
          </button>

          <div className="flex items-center gap-3">
            {table.getPageOptions().map((page) => (
              <button
                key={page}
                type="button"
                className={`size-8 flex justify-center items-center ${
                  page === table.getState().pagination.pageIndex
                    ? "bg-gray-200"
                    : "hover:bg-gray-200"
                } rounded-lg`}
                onClick={() => table.setPageIndex(page)}
              >
                {page + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-gray-500 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
          >
            <IconArrowRight />
          </button>

          {/* <button
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded-md text-xs bg-gray-300 disabled:opacity-50"
          >
            Last
          </button> */}
        </div>
      )}
    </div>
  );
}

export default Table;

// // tanstack table v8 with pagination, filter and sort
// import { useMemo, useState } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { IconArrowLeft, IconArrowRight } from "../Icons";

// function Table({ columns: columnsData, data: tableData }) {
//   const columns = useMemo(() => columnsData, [columnsData]);

//   const data = useMemo(() => tableData, [tableData]);

//   const [sorting, setSorting] = useState([]);
//   const [filtering, setFiltering] = useState("");

//   const table = useReactTable({
//     data,
//     columns,
//     defaultColumn: {
//       size: "auto",
//       // minSize: 200,
//     },
//     initialState: {
//       pagination: {
//         pageSize: 300,
//       },
//     },
//     state: {
//       sorting: sorting,
//       globalFilter: filtering,
//     },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setFiltering,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   return (
//     <div className="mt-8">
//       {data?.length > 0 && (
//         <div className="mb-5">
//           <input
//             type="text"
//             placeholder="Search"
//             value={filtering}
//             onChange={(e) => setFiltering(e.target.value)}
//             className="px-2 py-1.5 text-sm rounded-lg outline-none border border-gray-400 focus:border-gray-700"
//           />
//         </div>
//       )}

//       <div className="overflow-x-auto rounded-lg border border-gray-300">
//         <table className="w-full table-auto">
//           <thead className="border-b-2 border-gray-200">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <th
//                       key={header.id}
//                       style={{
//                         width: header.column.getSize() || "auto",
//                       }} // auto could change
//                       className={`px-4 py-3 text-sm capitalize text-left align-middle font-medium`}
//                     >
//                       {header.isPlaceholder ? null : (
//                         <span
//                           onClick={
//                             table.getRowModel().rows?.length
//                               ? header.column.getToggleSortingHandler()
//                               : null
//                           }
//                           className={`select-none ${
//                             header.column.getCanSort() &&
//                             table.getRowModel().rows?.length
//                               ? "cursor-pointer"
//                               : "cursor-default"
//                           }`}
//                         >
//                           {flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                           {{ asc: " 🔼", desc: " 🔽" }[
//                             table.getRowModel().rows?.length &&
//                               header.column.getIsSorted()
//                           ] ?? null}
//                         </span>
//                       )}
//                     </th>
//                   );
//                 })}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
//                   {row.getVisibleCells().map((cell) => (
//                     <td
//                       key={cell.id}
//                       // style={{
//                       //   width: cell.column.getSize(),
//                       // }}
//                       className="align-middle px-4 py-3 text-sm border-collapse border border-x-0 border-y-gray-200"
//                     >
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="py-3 text-center align-middle"
//                 >
//                   No results.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {table.getPageCount() > 1 && (
//         <div className="mt-5 flex justify-center items-center gap-3">
//           <button
//             type="button"
//             onClick={() => table.setPageIndex(0)}
//             disabled={!table.getCanPreviousPage()}
//             className="px-3 py-1.5 bg-gray-300 disabled:opacity-50 border rounded-md text-sm"
//           >
//             First
//           </button>

//           <button
//             type="button"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//             className="text-gray-500 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
//           >
//             <IconArrowLeft />
//           </button>

//           <div className="flex items-center gap-3">
//             {table.getPageOptions().map((page) => (
//               <button
//                 key={page}
//                 className={`size-8 flex justify-center items-center ${
//                   page === table.getState().pagination.pageIndex
//                     ? "bg-gray-200"
//                     : "hover:bg-gray-200"
//                 } rounded-lg`}
//                 onClick={() => table.setPageIndex(page)}
//               >
//                 {page + 1}
//               </button>
//             ))}
//             {/* {Array.from({ length: table.getPageCount() }, (_, i) => (
//             <button
//               key={i}
//               className={`size-8 flex justify-center items-center ${
//                 i === table.getState().pagination.pageIndex
//                   ? "bg-gray-200"
//                   : "hover:bg-gray-200"
//               } rounded-lg`}
//               onClick={() => table.setPageIndex(i)}
//             >
//               {i + 1}
//             </button>
//           ))} */}
//           </div>

//           <button
//             type="button"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//             className="text-gray-500 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
//           >
//             <IconArrowRight />
//           </button>

//           <button
//             type="button"
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//             disabled={!table.getCanNextPage()}
//             className="px-3 py-1.5 bg-gray-300 disabled:opacity-50 border rounded-md text-sm"
//           >
//             Last
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Table;
