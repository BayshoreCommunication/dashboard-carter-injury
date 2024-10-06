import useTheme from "@/hooks/useTheme";

function MessageCount({ dashboardData }) {
  const theme = useTheme();

  const messagesCount = [
    {
      name: "Today",
      count: dashboardData?.data.todayFound,
    },
    {
      name: "This Month",
      count: dashboardData?.data.thisMonthFound,
    },
    {
      name: "Total",
      count: dashboardData?.data.totalFound,
    },
  ];

  return (
    <>
      {dashboardData?.data && (
        <div>
          <p className="text-[35px] font-bold">Messages</p>
          <div className="mt-4 flex justify-between items-center gap-5">
            {messagesCount.map((message) => (
              <div
                key={message.name}
                className="h-[90px] 2xl:h-[100px] w-full flex justify-center items-center gap-3 rounded-2xl text-white"
                style={{ backgroundColor: theme }}
              >
                <span className="text-[25px] font-bold">{message.count}</span>
                <span className="text-xl">{message.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default MessageCount;
