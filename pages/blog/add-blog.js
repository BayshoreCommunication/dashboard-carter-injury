"use client";
import { useRouter } from "next/router";
import { toast } from "sonner";
import PageWrapper from "@/components/Layout/PageWrapper";
import BlogForm from "@/components/Blog/BlogForm";
import useGetData from "@/hooks/useGetData";
import usePostData from "@/hooks/usePostData";

function AddBlogPage() {
  const initialValues = {
    title: "",
    body: "",
    author: "",
    category: [],
    featuredImage: {},
    bodyImage: [],
    metaDescription: "",
    slug: "",
    published: false,
  };

  const router = useRouter();

  const { data: categoriesData, isPending: categoriesPending } = useGetData({
    path: "/category",
  });

  // console.log("categoriesData", categoriesData);

  const { mutate, isPending } = usePostData({
    path: "/blog",
    revalidate: "/blog",
  });

  const handleSubmit = (values, formik) => {
    // console.log("values", values);
    mutate(values, {
      onSuccess: () => {
        router.push("/blog");
        toast.success("Blog added successfully");
      },
    });
  };

  return (
    <PageWrapper
      title="Add New Blog"
      description="add new blog"
      heading="Add New Blog"
      isLoading={categoriesPending}
    >
      <BlogForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        isPending={isPending}
        categoriesData={categoriesData}
      />
    </PageWrapper>
  );
}

export default AddBlogPage;
