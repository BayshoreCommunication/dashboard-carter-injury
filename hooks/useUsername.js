import { useState, useEffect } from "react";
import { useSiteInfo } from "@/lib/store";

function useUsername() {
  const { username } = useSiteInfo();

  const [state, setState] = useState(null);

  useEffect(() => {
    setState(username);
  }, [username]);

  return state;
}

export default useUsername;
