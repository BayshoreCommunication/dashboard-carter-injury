import { Form, Formik } from "formik";
import slugify from "slugify";
import { toast } from "sonner";
import { InputField } from "../FormFields/InputField";
import Button from "../ui/Button";
import { TextareaField } from "../FormFields/TextareaField";
import usePostData from "@/hooks/usePostData";
import { Spinner } from "../Loading/Spinner";

function CategoryForm() {
  const initialValues = {
    name: "",
    slug: "",
    description: "",
  };

  const { mutate, isPending } = usePostData({
    path: "/category",
    revalidate: "/category",
  });

  const handleSubmit = (values, formik) => {
    // console.log("values", values);
    mutate(values, {
      onSuccess: () => {
        //console.log("onsuccess");
        toast.success(`Category ${values.name} added`);
        formik.resetForm();
      },
    });
  };

  return (
    <div className="mt-8">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className="space-y-9 w-full">
              <div className="flex items-center w-full gap-14">
                <InputField
                  label="Category Name:"
                  placeholder="Enter category name"
                  name="name"
                  type="text"
                  required
                  onChange={(e) => {
                    setFieldValue("name", e.target.value);
                    const slug = slugify(e.target.value, { lower: true });
                    setFieldValue("slug", slug);
                  }}
                />
                <InputField
                  label="Slug:"
                  placeholder="Enter the name to get slug"
                  name="slug"
                  type="text"
                  required
                />
              </div>

              <TextareaField
                label="Category Description:"
                placeholder="Enter category description"
                name="description"
                type="text"
                required
              />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button type="submit" className="px-6" disabled={isPending}>
                Create New Category
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

export default CategoryForm;
