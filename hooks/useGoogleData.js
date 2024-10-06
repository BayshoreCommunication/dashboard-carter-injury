import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function useGoogleData() {
  const url = "/api/google/data";

  const fetcher = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    return axios.get(url, config).then(({ data }) => data);
  };

  return useQuery({
    queryKey: [url],
    queryFn: fetcher,
    retry: false,
  });
}

export default useGoogleData;
