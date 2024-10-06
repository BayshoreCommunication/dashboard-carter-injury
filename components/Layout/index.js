import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import { navLinks } from "./navLinks";
import useGetData from "@/hooks/useGetData";
import { useSiteInfo } from "@/lib/store";

function Layout({ children }) {
  const { pathname } = useRouter();

  const { setUsername, setLogo, setTheme } = useSiteInfo();

  const { data: settingsData, isPending } = useGetData({
    path: "/user/setting",
  });

  // console.log("settingsdata", settingsData);

  useEffect(() => {
    settingsData?.data.name && setUsername(settingsData.data.name);
    settingsData?.data.logo && setLogo(settingsData.data.logo);
    settingsData?.data.color && setTheme(settingsData.data.color);
  }, [settingsData]);

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
