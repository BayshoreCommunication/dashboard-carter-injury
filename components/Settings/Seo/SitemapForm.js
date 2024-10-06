import { Form, Formik } from "formik";
import { toast } from "sonner";
import usePostData from "@/hooks/usePostData";
import Button from "@/components/ui/Button";
import { TextareaField } from "../../FormFields/TextareaField";

function SitemapForm({ values }) {
  const initialValues = {
    sitemap: values.sitemap || "",
  };

  const { mutate, isPending } = usePostData({
    path: "/user/sitemap",
  });

  const handleSubmit = (values, formik) => {
    // console.log("values", values);
    mutate(values, {
      onSuccess: () => {
        // console.log("onsuccess");
        toast.success(`Sitemap added`);
        formik.resetForm();
      },
    });
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <div>
              <TextareaField
                name="sitemap"
                className="w-full"
                required
                rows={8}
              />
              <div className="mt-5 flex items-center gap-5">
                <Button type="submit" className="px-9" disabled={isPending}>
                  Save
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SitemapForm;
