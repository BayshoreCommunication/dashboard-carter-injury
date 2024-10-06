import { useState } from "react";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import usePostData from "@/hooks/usePostData";
import { InputField2 } from "../../FormFields/InputField";
import Button from "@/components/ui/Button";

function NameChange({ name }) {
  const [isSelected, setIsSelected] = useState(false);
  const [nameState, setNameState] = useState(name);

  const initialValues = {
    name: name || "",
  };

  const { mutate, isPending } = usePostData({
    path: "/user/change/name",
    revalidate: "/user/setting",
  });

  const handleSubmit = (values, formik) => {
    // console.log("values", values);
    mutate(values, {
      onSuccess: () => {
        // console.log("onsuccess");
        toast.success(`Name changed successfully`);
        formik.resetForm();
        setNameState(values.name);
        setIsSelected(false);
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, resetForm }) => (
        <Form>
          <label htmlFor="">Name</label>
          <div className="flex w-full items-center gap-5">
            {isSelected ? (
              <InputField2
                name="name"
                type="text"
                required
                autoFocus={isSelected}
              />
            ) : (
              <p className="pl-0.5 pt-1 font-bold text-gray-400 text-2xl w-full">
                {nameState}
              </p>
            )}
            {!isSelected ? (
              <Button
                type="button"
                className="w-[200px]"
                onClick={() => setIsSelected(true)}
              >
                Change Name
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
  );
}

export default NameChange;
