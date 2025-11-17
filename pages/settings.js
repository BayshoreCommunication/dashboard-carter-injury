import PageWrapper from "@/components/Layout/PageWrapper";
import AccountSettings from "@/components/Settings/Account";
import CompanyDetails from "@/components/Settings/Company";
import SeoSettings from "@/components/Settings/Seo";
import useGetData from "@/hooks/useGetData";
import useTheme from "@/hooks/useTheme";

function SettingsPage() {
  const theme = useTheme();

  const {
    data: settingsData,
    isPending,
    isError,
    error,
  } = useGetData({
    path: "/user/setting",
  });

  // console.log("settingsData", settingsData);

  const data = {
    name: settingsData?.data?.name || "",
    color: settingsData?.data?.color || theme,
    email: settingsData?.data?.email || "",
    logo: settingsData?.data?.logo || "",
  };

  return (
    <PageWrapper
      title="Settings"
      description="settings"
      heading="Settings"
      isLoading={isPending}
    >
      {isError ? (
        <div className="mt-5 p-5 border border-gray-300 rounded-xl bg-gray-50">
          <p className="text-gray-600">
            Unable to load settings. Please try again later.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 space-y-7">
            <CompanyDetails
              logo={data.logo}
              name={data.name}
              color={data.color}
            />
            <AccountSettings currentEmail={data.email} />
          </div>

          <SeoSettings />
        </>
      )}
    </PageWrapper>
  );
}

export default SettingsPage;
