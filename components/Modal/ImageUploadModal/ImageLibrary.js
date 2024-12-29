"use client";
import { useState } from "react";
import Image from "next/image";
import { IconTick } from "@/components/Icons";
import Button from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetData from "@/hooks/useGetData";
import { Spinner } from "@/components/Loading/Spinner";

function ImageLibrary({ setShowImageModal, handleImageSubmit }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: mediaData, isPending } = useGetData({ path: "/media" });

  // console.log("mediadata", mediaData);

  const handleImageClick = (media) => {
    if (selectedImage?._id === media._id) {
      setSelectedImage(null);
    } else {
      setSelectedImage(media);
    }
  };

  const handleSaveImage = () => {
    const imageValues = {
      image: selectedImage.image,
      altText: selectedImage.altText,
      imageTitle: selectedImage.imageTitle,
    };
    handleImageSubmit(imageValues);

    setShowImageModal(false);
  };

  return (
    <div>
      {isPending ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner className="size-20 border-[6px]  border-cyan-500 border-r-cyan-500/30 border-b-cyan-500/30" />
        </div>
      ) : (
        <>
          {mediaData?.media.length > 0 ? (
            <>
              <ScrollArea className="h-[350px] 2xl:h-[430px] relative">
                <div className="p-3 grid grid-cols-4 2xl:grid-cols-5 justify-items-center gap-7 overflow-x-hidden overflow-y-auto">
                  {mediaData?.media.map((media) => (
                    <div
                      key={media._id}
                      className={`relative size-[150px] rounded-md overflow-hidden cursor-pointer`}
                      onClick={() => handleImageClick(media)}
                    >
                      <Image
                        src={media.image.url}
                        alt={media.altText}
                        fill
                        // sizes="150px"
                        className="object-cover border  border-gray-200 rounded-md"
                      />

                      {selectedImage?._id === media._id && (
                        <div className="absolute inset-0 border-[6px] border-cyan-400 rounded-md">
                          <div className="absolute top-0 right-0 size-6 flex justify-center items-center bg-cyan-400 border border-white text-white">
                            <IconTick />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button
                type="button"
                className="ml-3 mt-5 w-[150px]"
                disabled={!selectedImage}
                onClick={handleSaveImage}
              >
                Save
              </Button>
            </>
          ) : (
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="text-2xl font-semibold">No image found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ImageLibrary;
