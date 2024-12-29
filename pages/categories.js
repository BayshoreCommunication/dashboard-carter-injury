import useGetData from "@/hooks/useGetData";
import CategoryForm from "@/components/Category/CategoryForm";
import PageWrapper from "@/components/Layout/PageWrapper";
import Table from "@/components/Table";
import { categoriesColumn } from "@/components/Table/columns/categories-column";

function CategoriesPage() {
  const { data: categoriesData, isPending } = useGetData({ path: "/category" });

  //console.log("categoriesData", categoriesData);

  return (
    <PageWrapper
      title="Categories"
      description="categories"
      heading="Add New Category"
      isLoading={isPending}
    >
      <CategoryForm />

      {categoriesData?.data?.length ? (
        <Table columns={categoriesColumn} data={categoriesData.data} />
      ) : (
        <p className="mt-10 text-center font-bold text-lg">No results</p>
      )}
    </PageWrapper>
  );
}

export default CategoriesPage;
