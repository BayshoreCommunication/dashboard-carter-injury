import useGetData from "@/hooks/useGetData";
import { useSiteInfo } from "@/lib/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { navLinks } from "./navLinks";

function Layout({ children }) {
  const { pathname } = useRouter();

  const { setUsername, setLogo, setTheme } = useSiteInfo();

  const {
    data: settingsData,
    isPending,
    isError,
  } = useGetData({
    path: "/user/setting",
  });

  // console.log("settingsdata", settingsData);

  useEffect(() => {
    if (settingsData?.data && !isError) {
      settingsData.data.name && setUsername(settingsData.data.name);
      settingsData.data.logo && setLogo(settingsData.data.logo);
      settingsData.data.color && setTheme(settingsData.data.color);
    }
  }, [settingsData, isError, setUsername, setLogo, setTheme]);

  if (pathname === "/sign-in") {
    return <>{children}</>;
  }

  return (
    <div className="lg:flex">
      <Sidebar navLinks={navLinks} />

      <div className="lg:flex-1 relative overflow-x-auto">
        <main className="my-10 mx-2 lg:mx-7">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
