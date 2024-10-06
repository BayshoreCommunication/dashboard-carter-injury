import { Form, Formik } from "formik";
import { toast } from "sonner";
import usePostData from "@/hooks/usePostData";
import Button from "@/components/ui/Button";
import { InputField } from "../FormFields/InputField";
import { TextareaField } from "../FormFields/TextareaField";
import { Spinner } from "../Loading/Spinner";

function MediaForm({ id, imageTitle, altText, setImageTitleState }) {
  const initialValues = {
    imageTitle: imageTitle || "",
    altText: altText || "",
  };

  const { mutate, isPending } = usePostData({
    path: `/media/edit/${id}`,
    revalidate: "/media",
  });

  const handleSubmit = (values) => {
    // console.log("values", values);
    mutate(values, {
      onSuccess: () => {
        // console.log("onsuccess");
        toast.success(`Image details changed`);
        setImageTitleState(values.imageTitle);
        // formik.resetForm();
      },
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <InputField
              label="Image Title:"
              placeholder="Your text here"
              name="imageTitle"
              type="text"
              required
            />
            <TextareaField
              label="Alt Text"
              placeholder="Your text here"
              name="altText"
              required
            />

            <div className="mt-5 flex items-center gap-3">
              <Button type="submit" className="px-8" disabled={isPending}>
                Save
              </Button>
              {isPending && (
                <Spinner className="border-gray-400 border-r-gray-400/30 border-b-gray-400/30" />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default MediaForm;
