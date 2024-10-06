import { useState } from "react";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import { InputField2 } from "../../FormFields/InputField";
import Button from "@/components/ui/Button";
import usePostData from "@/hooks/usePostData";

function EmailChange({ currentEmail }) {
  const [isSelected, setIsSelected] = useState(false);
  const [emailState, setEmailState] = useState(currentEmail);

  const initialValues = {
    email: currentEmail || "",
  };

  const { mutate, isPending } = usePostData({
    path: "/user/change/email",
    revalidate: "/user/setting",
  });

  const handleSubmit = (values, formik) => {
    // console.log("values", values);
    mutate(values, {
      onSuccess: () => {
        // console.log("onsuccess");
        toast.success(`Email changed successfully`);
        formik.resetForm();
        setEmailState(values.email);
        setIsSelected(false);
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
        {({ isSubmitting, resetForm }) => (
          <Form>
            <label htmlFor="">Email</label>
            <div className="flex w-full items-center gap-5">
              {isSelected ? (
                <InputField2
                  name="email"
                  type="email"
                  required
                  autoFocus={isSelected}
                />
              ) : (
                <p className="pl-0.5 pt-1 font-bold text-gray-400 text-2xl w-full">
                  {emailState}
                </p>
              )}
              {!isSelected ? (
                <Button
                  type="button"
                  className="w-[200px]"
                  onClick={() => setIsSelected(true)}
                >
                  Change Email
                </Button>
              ) : (
                <div className="flex items-center gap-5">
                  <Button
                    type="button"
                    className="w-[100px]"
                    variant="outline"
                    onClick={() => {
                      setIsSelected(false);
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
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EmailChange;
