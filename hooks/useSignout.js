import { signOut } from "next-auth/react";

function useSignout() {
  const signout = () => {
    signOut({
      callbackUrl: `${window.location.origin}/sign-in`,
      // redirect: false,
    });
  };

  return { signout };
}

export default useSignout;
