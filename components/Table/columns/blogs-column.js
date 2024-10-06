import Link from "next/link";
import DeleteBlog from "../actions/DeleteBlog";
import { IconEdit } from "@/components/Icons";

export const blogsColumn = [
  {
    header: "#",
    accessorKey: "_id",
    size: 70,
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Title",
    accessorKey: "title",
    size: 350,
  },
  {
    header: "Meta Description",
    accessorKey: "metaDescription",
  },
  {
    header: "Status",
    accessorKey: "published",
    size: 120,
    cell: ({ row }) => (row.original.published ? "Publish" : "Draft"),
  },
  {
    header: "Action",
    accessorKey: "slug",
    enableSorting: false,
    size: 100,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DeleteBlog blogInfo={row.original} />

        <div>
          <Link
            href={`/blog/edit-blog/${row.original.slug}`}
            className="text-black"
          >
            <IconEdit />
          </Link>
        </div>
      </div>
    ),
  },
];
