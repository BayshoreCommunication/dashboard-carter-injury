import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";

function useGetDataPublic({ path }) {
  const url = `${API_URL}${path}`;

  const fetcher = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    return axios.get(url, config).then(({ data }) => data);
  };

  return useQuery({
    queryKey: [path],
    queryFn: fetcher,
    retry: false,
  });
}

export default useGetDataPublic;
