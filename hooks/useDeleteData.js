import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config";

function useDeleteData({ path, revalidate }) {
  const { data: session } = useSession();

  const token = session?.user?.token;

  const url = `${API_URL}${path}`;

  const queryClient = useQueryClient();

  const postFn = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.post(url, {}, config).then(({ data }) => data);
  };

  return useMutation({
    mutationFn: postFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries([revalidate]);
      // console.log(data);
    },
    onError: (error) => {
      console.log("error is", error.response.data);
      toast.error("Something went wrong");
    },
  });
}

export default useDeleteData;
