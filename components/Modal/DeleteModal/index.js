"use client";
// import Lottie from "lottie-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Button from "@/components/ui/Button";
// import deleteLottie from "@/public/lottie/delete-lottie.json";
import { Spinner } from "@/components/Loading/Spinner";
import { FaTrashCan } from "react-icons/fa6";

function DeleteModal({
  showDeleteModal,
  setShowDeleteModal,
  title,
  handleDelete,
  isPending,
  children,
}) {
  return (
    <AlertDialog
      open={showDeleteModal}
      onOpenChange={setShowDeleteModal}
      // key={categoryInfo.id}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className="bg-white w-[626px] p-9 flex flex-col items-center">
        <div className=" flex flex-col items-center">
          <p className="text-lg font-medium">{title}</p>

          {/* <div className="mt-2 size-[116px]">
            <Lottie animationData={deleteLottie} />
          </div> */}
          <div className=" size-28  m-auto flex justify-center items-center rounded-full border-red-500 border p-2 my-6">
            <FaTrashCan className="text-red-500 size-16 " />
          </div>

          <div className=" flex justify-center gap-5">
            <Button
              type="button"
              variant="outline"
              className="w-[124px] relative"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && (
                <div className="absolute inset left-3.5">
                  <span>
                    <Spinner className="border-gray-300 border-r-gray-300/30 border-b-gray-300/30" />
                  </span>
                </div>
              )}
              Yes
            </Button>
            <Button
              type="button"
              className="w-[124px]"
              onClick={() => setShowDeleteModal(false)}
              disabled={isPending}
            >
              No
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteModal;
