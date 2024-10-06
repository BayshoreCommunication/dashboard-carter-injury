import { useState } from "react";
import { toast } from "sonner";
import { IconDelete } from "@/components/Icons";
import useDeleteData from "@/hooks/useDeleteData";
import DeleteModal from "@/components/Modal/DeleteModal";

function DeleteBlog({ blogInfo }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate, isPending } = useDeleteData({
    path: `/blog/delete/${blogInfo._id}`,
    revalidate: "/blog",
  });

  // console.log("ispending", isPending);

  const handleDelete = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          // console.log("onsuccess");
          toast.success(`Blog deleted`);
          setShowDeleteModal(false);
        },
        onError: () => {
          console.log("onerror");
          setShowDeleteModal(false);
        },
      }
    );
  };

  return (
    <DeleteModal
      key={blogInfo._id}
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
      title={`Do you want to delete this blog?`}
      handleDelete={handleDelete}
      isPending={isPending}
    >
      <button type="button" className="text-custom-red2">
        <IconDelete />
      </button>
    </DeleteModal>
  );
}

export default DeleteBlog;
