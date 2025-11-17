import useLogo from "@/hooks/useLogo";
import useSignout from "@/hooks/useSignout";
import useTheme from "@/hooks/useTheme";
import { useSiteInfo } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconLogout } from "../Icons/IconLogout";

function Sidebar({ navLinks }) {
  const router = useRouter();
  const theme = useTheme();
  const logo = useLogo();
  const { setUsername, setLogo } = useSiteInfo();

  const { signout } = useSignout();

  const activeClass = (path) => {
    if (path === "/" && router.pathname === path) {
      return {
        backgroundColor: theme,
        color: "white",
      };
    }

    if (path !== "/" && router.pathname.includes(path)) {
      return {
        backgroundColor: theme,
        color: "white",
      };
    }

    return {
      color: "black",
      // ":hover": {
      //   // backgroundColor: "#37b546/10",
      //   backgroundColor: theme,
      //   opacity: 0.4,
      // },
    };
  };

  const activeIcon = (path) => {
    if (path === "/" && router.pathname === path) {
      return {
        backgroundColor: theme,
        color: "white",
      };
    }

    if (path !== "/" && router.pathname.includes(path)) {
      return {
        backgroundColor: theme,
        color: "white",
      };
    }

    return {
      color: theme,
    };
  };

  return (
    <div className="sidebar h-screen overflow-y-auto bg-white z-30 top-0 bottom-0 sticky border-r border-gray-400 w-[260px]">
      <div className="mb-5">
        <div className="px-[47px] py-9">
          <div className="relative w-[155px] h-[155px]">
            {logo && (
              <Image
                // src="/images/static-logo.png"
                src={logo}
                alt="static logo"
                sizes="200px"
                // sizes="100vw"
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>

        <div className="mt-12 mx-[47px] space-y-5 text-[17px]">
          {navLinks?.map((navLink, i) => (
            <div key={i} className="w-[160px]">
              <Link href={navLink.link} passHref>
                <div
                  className={`px-6 py-2 flex justify-between items-center rounded-full font-semibold transition-colors duration-200 hover:bg-gray-100`}
                  style={activeClass(navLink.link)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="transition-colors duration-200"
                      style={activeIcon(navLink.link)}
                    >
                      {navLink.icon}
                    </span>

                    <p>{navLink.name}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          <button
            type="button"
            className={`px-6 py-2 flex justify-between items-center group font-semibold transition-colors duration-200 rounded-full w-[160px] hover:bg-gray-100`}
            // style={{
            //   ":active": {
            //     backgroundColor: theme,
            //     color: "white",
            //   },
            // }}
            onClick={() => {
              signout();
              setUsername(null);
              // setLogo(null);
            }}
          >
            <div className="flex items-center gap-3">
              <span style={{ color: theme }}>
                <IconLogout />
              </span>
              <p>Logout</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
