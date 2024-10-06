import PageWrapper from "@/components/Layout/PageWrapper";

function NotFoundPage() {
  return (
    <PageWrapper
      title="Page not found"
      description="page not found"
      heading="Page Not Found"
    >
      <div className="min-h-[calc(100vh-150px)] flex justify-center items-center">
        <p className="text-4xl font-bold">404 | Page not found</p>
      </div>
    </PageWrapper>
  );
}

export default NotFoundPage;
