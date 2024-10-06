import useGetDataPublic from "@/hooks/useGetDataPublic";
import PageWrapper from "@/components/Layout/PageWrapper";
import Table from "@/components/Table";
import { messagesColumn } from "@/components/Table/columns/messages-column";

function MessagePage() {
  const { data: messagesData, isPending } = useGetDataPublic({
    path: "/user/messages",
  });

  // console.log("data", messagesData);

  return (
    <PageWrapper
      title="Messages"
      description="messages"
      heading="Messages"
      isLoading={isPending}
    >
      {messagesData?.data?.length ? (
        <Table columns={messagesColumn} data={messagesData.data} />
      ) : (
        <p className="mt-10 text-center font-bold text-lg">No results</p>
      )}
    </PageWrapper>
  );
}

export default MessagePage;
