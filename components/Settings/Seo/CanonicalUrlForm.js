import { Form, Formik } from "formik";
import { toast } from "sonner";
import usePostData from "@/hooks/usePostData";
import Button from "@/components/ui/Button";
import { InputField } from "../../FormFields/InputField";

function CanonicalUrlForm() {
  const initialValues = {
    canonical: "",
  };

  const { mutate, isPending } = usePostData({
    path: "/user/canonical",
  });

  const handleSubmit = (values, formik) => {
    // console.log("values", values);
    mutate(values, {
      onSuccess: () => {
        // console.log("onsuccess");
        toast.success(`Canonical url added`);
        formik.resetForm();
      },
    });
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField name="canonical" type="text" required />

            <div className="mt-5">
              <Button type="submit" className="px-5" disabled={isPending}>
                Canonical Url
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CanonicalUrlForm;
