import { Form, Formik } from "formik";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import ColorPickerField from "../../FormFields/ColorPickerField";
import usePostData from "@/hooks/usePostData";

function ColorChange({ color }) {
  const { mutate, isPending, variables } = usePostData({
    path: "/color/edit",
    revalidate: "/user/setting",
  });

  const handleSubmit = (values, formik) => {
    // console.log("values", values);

    mutate(values, {
      onSuccess: () => {
        // console.log("onsuccess");
        toast.success(`Color changed successfully`);
      },
    });
  };

  if (!color) return;

  const initialValues = {
    color: color,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, resetForm }) => (
        <Form>
          <div>
            <label htmlFor="">Brand Color</label>
            <div className="mt-4">
              <div className="flex items-center w-full justify-between">
                <ColorPickerField name="color" />
                {color !== values.color && (
                  <div className="flex items-center gap-5">
                    <Button
                      type="button"
                      className="w-[100px]"
                      variant="outline"
                      onClick={() => {
                        resetForm();
                      }}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-[100px]"
                      disabled={isPending}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ColorChange;
