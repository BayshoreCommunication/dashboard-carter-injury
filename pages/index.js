import useGetData from "@/hooks/useGetData";
import GoogleData from "@/components/Console/GoogleData";
import MessageCount from "@/components/Dashboard/MessageCount";
import PageWrapper from "@/components/Layout/PageWrapper";

export default function Home() {
  const { data: dashboardData, isPending } = useGetData({
    path: "/user/dashboard",
  });

  //console.log("dashboardData", dashboardData);

  return (
    <PageWrapper
      title="Dashboard"
      description="dashboard"
      heading="Dashboard"
      isLoading={isPending}
    >
      <GoogleData />

      <div className="mt-16">
        <MessageCount dashboardData={dashboardData} />
      </div>
    </PageWrapper>
  );
}
