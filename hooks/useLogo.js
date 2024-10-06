import { useState, useEffect } from "react";
import { useSiteInfo } from "@/lib/store";

function useLogo() {
  const { logo } = useSiteInfo();

  const [state, setState] = useState(null);

  useEffect(() => {
    setState(logo);
  }, [logo]);

  return state;
}

export default useLogo;
