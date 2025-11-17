import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function useSignin() {
  const router = useRouter();

  const signin = async (values) => {
    try {
      const response = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (response?.ok) {
        // console.log(response);
        router.push("/");
      } else if (response?.error) {
        //console.log("error response", response.error);
        toast.error(response.error);
      }
    } catch (error) {
      //console.log("error auth", error);
      toast.error("Something went wrong");
    }
  };

  return { signin };
}

export default useSignin;
