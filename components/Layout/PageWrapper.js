import Head from "next/head";
import { useRouter } from "next/router";
import { PageSpinner } from "../Loading/Spinner";
import useTheme from "@/hooks/useTheme";
import useUsername from "@/hooks/useUsername";

function PageWrapper({ title, description, heading, isLoading, children }) {
  const { pathname } = useRouter();

  const theme = useTheme();
  const username = useUsername();

  return (
    <div className="relative">
      <Head>
        <title>{title || "Dashboard"}</title>
        {/* <title>{`${title || "Title"} ${
          username ? ` - ${username}` : ""
        } `}</title> */}
        <meta name="description" content={description || "dashboard"} />
        {/* <link rel="shortcut icon" href={logo} /> */}
      </Head>

      {heading && (
        <div className="leading-10 pb-7 border-b border-gray-300 flex justify-between">
          <div>
            <h1 className="text-[35px] font-extrabold">{heading}</h1>
            {pathname === "/" && (
              <p className="text-sm font-medium">
                Hi <span style={{ color: theme }}>{username}</span>, Welcome
                back!
              </p>
            )}
          </div>

          <p className="text-xl font-bold" style={{ color: theme }}>
            {username}
          </p>
        </div>
      )}

      <div>{isLoading ? <PageSpinner /> : children}</div>
    </div>
  );
}

export default PageWrapper;
