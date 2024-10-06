import { Form, Formik } from "formik";
import Button from "@/components/ui/Button";
import { InputField } from "@/components/FormFields/InputField";
import { TextareaField } from "@/components/FormFields/TextareaField";
import { Spinner } from "@/components/Loading/Spinner";

function ImageSubmitForm({
  imageId,
  imageUrl,
  handleImageSubmit,
  imageSubmitting,
}) {
  const initialValues = {
    imageTitle: "",
    altText: "",
    image: {
      public_id: imageId,
      url: imageUrl,
    },
  };

  const handleSubmit = (values, formik) => {
    // console.log("values", values);
    handleImageSubmit(values, formik);
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
              className="resize-none"
              required
            />

            <div className="mt-5 flex items-center gap-3">
              <Button type="submit" className="px-8" disabled={imageSubmitting}>
                Save
              </Button>
              {imageSubmitting && (
                <Spinner className="border-gray-400 border-r-gray-400/30 border-b-gray-400/30" />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ImageSubmitForm;
