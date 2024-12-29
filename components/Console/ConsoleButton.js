import { toast } from "sonner";
import Button from "../ui/Button";

function ConsoleButton() {
  const handleAuthClick = async () => {
    try {
      const response = await fetch("/api/google/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      //console.log(response);

      if (response.ok) {
        const result = await response.json();
        // console.log("result", result);
        window.location.assign(result.url);
      } else {
        toast.error("Authentication failed");
        // setMessage("Authentication failed");
      }
    } catch (error) {
      toast.error("Error during authentication");
      console.error("Error during authentication:", error.message);
    }
  };

  return (
    <Button type="button" onClick={handleAuthClick}>
      Connect with your search console
    </Button>
  );
}

export default ConsoleButton;

// import { useSession } from "next-auth/react";
// import Button from "../ui/Button";
// import { API_URL } from "@/config";
// import useGetData from "@/hooks/useGetData";

// function ConsoleButton() {
//   const { data: session } = useSession();

//   const token = session?.user?.token;

//   const url = `${API_URL}/auth/google`;

//   const handleClick = async () => {
//     const res = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     const data = await res.json();
//     console.log("data", data);
//   };

//   return (
//     <Button type="button" onClick={handleClick}>
//       Connect with your search console
//     </Button>
//   );
// }

// export default ConsoleButton;
