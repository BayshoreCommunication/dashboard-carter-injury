import DeleteCategory from "../actions/DeleteCategory";

export const categoriesColumn = [
  {
    header: "#",
    accessorKey: "_id",
    size: 70,
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Action",
    accessorKey: "_id",
    enableSorting: false,
    size: 100,
    cell: ({ row }) => (
      <div>
        <DeleteCategory categoryInfo={row.original} />
      </div>
    ),
  },
];
