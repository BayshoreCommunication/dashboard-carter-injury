import { Form, Formik } from "formik";
import { toast } from "sonner";
import usePostData from "@/hooks/usePostData";
import Button from "@/components/ui/Button";
import { TextareaField } from "../../FormFields/TextareaField";

function RobotsTxtForm({ values }) {
  const initialValues = {
    robotsTxt: values.robots_txt || "",
  };

  const { mutate, isPending } = usePostData({
    path: "/user/robots",
  });

  const handleSubmit = (values, formik) => {
    // console.log("values", values);
    const singleValue = {
      robotsTxt: values.robotsTxt,
    };

    mutate(singleValue, {
      onSuccess: () => {
        // console.log("onsuccess");
        toast.success(`Robots text added`);
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
                name="robotsTxt"
                className="w-full"
                required
                rows={6}
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

export default RobotsTxtForm;
