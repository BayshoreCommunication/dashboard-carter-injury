import { useRouter } from "next/router";
import { toast } from "sonner";
import BlogForm from "@/components/Blog/BlogForm";
import PageWrapper from "@/components/Layout/PageWrapper";
import useGetData from "@/hooks/useGetData";
import usePostData from "@/hooks/usePostData";

function EditBlogPage() {
  const router = useRouter();

  const slug = router.query?.slug;

  const { data: categoriesData, isPending: categoriesPending } = useGetData({
    path: "/category",
  });

  const { data, isPending: blogPending } = useGetData({
    path: `/user/single/${slug}`,
  });

  const blogData = data?.success;

  const initialValues = {
    title: blogData?.title || "",
    body: blogData?.body || "",
    author: blogData?.author || "",
    category: blogData?.category || [],
    featuredImage: blogData?.featuredImage || {},
    bodyImage: blogData?.bodyImage || [],
    metaDescription: blogData?.metaDescription || "",
    slug: blogData?.slug || "",
    published: blogData?.published || false,
  };

  // console.log("single blog", data?.success);

  const { mutate, isPending } = usePostData({
    path: `/blog/edit/${blogData?._id}`,
    revalidate: "/blog",
  });

  const handleSubmit = (values, formik) => {
    // console.log("values", values);
    mutate(values, {
      onSuccess: () => {
        router.push("/blog");
        toast.success("Blog edited successfully");
      },
    });
  };

  return (
    <PageWrapper
      title="Edit Blog"
      description="edit blog"
      heading="Edit Blog"
      isLoading={blogPending || categoriesPending}
    >
      <BlogForm
        categoriesData={categoriesData}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        isPending={isPending}
      />
    </PageWrapper>
  );
}

export default EditBlogPage;
