import useGetData from "@/hooks/useGetData";
import PageWrapper from "@/components/Layout/PageWrapper";
import Table from "@/components/Table";
import { blogsColumn } from "@/components/Table/columns/blogs-column";
import LinkButton from "@/components/ui/LinkButton";

function BlogPage() {
  const { data: blogsData, isPending } = useGetData({ path: "/blog" });

  // console.log("blogdata", blogsData);

  return (
    <PageWrapper
      title="Blog"
      description="blog"
      heading="All Blogs"
      isLoading={isPending}
    >
      <div className="mt-10 flex justify-end">
        <LinkButton href="/blog/add-blog">New Post</LinkButton>
      </div>

      {blogsData?.data?.length ? (
        <Table columns={blogsColumn} data={blogsData.data} />
      ) : (
        <p className="mt-10 text-center font-bold text-lg">No blogs found</p>
      )}
    </PageWrapper>
  );
}

export default BlogPage;
