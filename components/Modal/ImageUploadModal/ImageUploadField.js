"use client";
import { IconCloudArrow } from "@/components/Icons";
import { Spinner } from "@/components/Loading/Spinner";
import {
  DIGITALOCEAN_API_KEY,
  DIGITALOCEAN_ENDPOINT,
  DIGITALOCEAN_FOLDER,
  DIGITALOCEAN_SECRET_ACCESS_KEY,
} from "@/config";
import useTheme from "@/hooks/useTheme";
import AWS from "aws-sdk";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import ImageSubmitForm from "./ImageSubmitForm";
import LogoSubmit from "./LogoSubmit";

function ImageUploadField({
  imageUploading,
  setImageUploading,
  setImageUploaded,
  setShowImageModal,
  isLogo,
  handleImageSubmit,
  imageSubmitting,
}) {
  const s3 = new AWS.S3({
    endpoint: DIGITALOCEAN_ENDPOINT,
    accessKeyId: DIGITALOCEAN_API_KEY,
    secretAccessKey: DIGITALOCEAN_SECRET_ACCESS_KEY,
  });

  const theme = useTheme();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageId, setImageId] = useState(null);

  const imageMaxSize = 500;

  const handleImageUpload = useCallback(async () => {
    if (!image) return;

    // Check image size
    if (image.size > imageMaxSize * 1024) {
      toast.error(`Image size exceeds the limit of ${imageMaxSize}KB`);
      return;
    }

    // Generate a unique filename
    const uniqueFileName = `${DIGITALOCEAN_FOLDER}/${Date.now()}-${uuidv4()}-${encodeURIComponent(
      image.name
    )}`;

    // Set upload parameters
    const params = {
      Bucket: "bayshore",
      Key: uniqueFileName,
      Body: image,
      ACL: "public-read",
      ContentType: image.type,
    };

    setImageUploading(true);

    try {
      // Upload the image to DigitalOcean Spaces
      const { Location } = await s3.upload(params).promise();

      // Update state with the uploaded image URL and ID
      setImageUrl(Location);
      setImageId(uniqueFileName);
      setImageUploaded(true);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed, please try again.");
    } finally {
      setImageUploading(false);
    }
  }, [image, setImageUploading, setImageUploaded]);

  // Trigger upload when image changes
  useEffect(() => {
    if (image) {
      handleImageUpload();
    }
  }, [image, handleImageUpload]);

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const selectedImage = e.target.files[0];

    // Validate image size
    if (selectedImage.size > imageMaxSize * 1024) {
      toast.error(`Image size exceeds the limit of ${imageMaxSize}KB`);
      return;
    }

    // Set the image and preview
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files.length > 1) {
      toast.error("Only one image can be uploaded at a time.");
      return;
    }

    const droppedImage = e.dataTransfer.files[0];

    // Validate image size
    if (droppedImage.size > imageMaxSize * 1024) {
      toast.error(`Image size exceeds the limit of ${imageMaxSize}KB`);
      return;
    }

    // Set the image and preview
    setImage(droppedImage);
    setImagePreview(URL.createObjectURL(droppedImage));
  };

  return (
    <>
      {!imagePreview ? (
        <div
          className={`h-full flex flex-col justify-center items-center rounded-xl border-2 border-dashed
            text-gray-300 ${dragging ? "border-blue-500" : "border-gray-300"}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span>
            <IconCloudArrow />
          </span>
          <p className="mt-5 text-xl font-medium">Drag and drop asset here</p>
          <p className="mt-1 text-sm">{`Image size (Max ${imageMaxSize}KB)`}</p>
          <p className="mt-3 font-medium text-black text-lg">Or</p>

          <input
            type="file"
            accept=".jpg, .jpeg, .png, .svg"
            id="image"
            onChange={handleImageChange}
            className="hidden"
          />

          <label
            htmlFor="image"
            className="mt-3 px-4 py-2 rounded-full w-[250px] flex justify-center border text-white disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            style={{
              borderColor: theme,
              backgroundColor: theme,
            }}
          >
            Browse
          </label>
        </div>
      ) : (
        <div className="w-full h-full border-2 border-transparent bg-black rounded-lg">
          {imageUploading ? (
            <>
              <Image
                src={imagePreview}
                alt="image uploaded preview"
                fill
                className="object-cover blur-md opacity-50 rounded-lg"
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <Spinner className="size-20 border-[6px]" />
              </div>
            </>
          ) : (
            imageUrl && (
              <>
                <Image
                  src={imageUrl}
                  alt="image uploaded result"
                  fill
                  className="object-cover rounded-lg"
                />

                {!isLogo ? (
                  <div className="absolute inset-0 flex justify-center items-center h-full">
                    <div className="w-[330px] px-7 py-5 bg-white rounded-lg">
                      <ImageSubmitForm
                        imageId={imageId}
                        imageUrl={imageUrl}
                        setShowImageModal={setShowImageModal}
                        handleImageSubmit={handleImageSubmit}
                        imageSubmitting={imageSubmitting}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 absolute right-3 bottom-3">
                    <LogoSubmit
                      logo={imageUrl}
                      handleImageSubmit={handleImageSubmit}
                      imageSubmitting={imageSubmitting}
                    />
                  </div>
                )}
              </>
            )
          )}
        </div>
      )}
    </>
  );
}

export default ImageUploadField;
