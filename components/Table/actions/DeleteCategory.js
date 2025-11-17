import { useState } from "react";
import { toast } from "sonner";
import useDeleteData from "@/hooks/useDeleteData";
import { IconDelete } from "@/components/Icons";
import DeleteModal from "@/components/Modal/DeleteModal";

function DeleteCategory({ categoryInfo }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate, isPending } = useDeleteData({
    path: `/category/delete/${categoryInfo._id}`,
    revalidate: "/category",
  });

  // console.log("ispending", isPending);

  const handleDelete = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          // console.log("onsuccess");
          toast.success(`Category ${categoryInfo.name} deleted`);
          setShowDeleteModal(false);
        },
        onError: () => {
          //console.log("onerror");
          setShowDeleteModal(false);
        },
      }
    );
  };

  return (
    <DeleteModal
      key={categoryInfo.id}
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
      title={`Do you want to delete category ${categoryInfo.name}?`}
      handleDelete={handleDelete}
      isPending={isPending}
    >
      <button type="button" className="text-custom-red2">
        <IconDelete />
      </button>
    </DeleteModal>
  );
}

export default DeleteCategory;
