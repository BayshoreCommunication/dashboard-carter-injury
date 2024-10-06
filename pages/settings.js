import AccountSettings from "@/components/Settings/Account";
import CompanyDetails from "@/components/Settings/Company";
import PageWrapper from "@/components/Layout/PageWrapper";
import useGetData from "@/hooks/useGetData";
import useTheme from "@/hooks/useTheme";
import SeoSettings from "@/components/Settings/Seo";

function SettingsPage() {
  const theme = useTheme();

  const { data: settingsData, isPending } = useGetData({
    path: "/user/setting",
  });

  // console.log("settingsData", settingsData);

  const data = {
    name: settingsData?.data.name,
    color: settingsData?.data.color || theme,
    email: settingsData?.data.email,
    logo: settingsData?.data.logo,
  };

  return (
    <PageWrapper
      title="Settings"
      description="settings"
      heading="Settings"
      isLoading={isPending}
    >
      <div className="mt-5 space-y-7">
        <CompanyDetails logo={data.logo} name={data.name} color={data.color} />
        <AccountSettings currentEmail={data.email} />
      </div>

      <SeoSettings />
    </PageWrapper>
  );
}

export default SettingsPage;
