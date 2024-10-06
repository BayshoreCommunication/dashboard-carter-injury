import { useState } from "react";
import { Inter, Manrope } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Layout from "@/components/Layout";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <div className={`${inter.className} ${manrope.variable} text-black`}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
        </SessionProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}
