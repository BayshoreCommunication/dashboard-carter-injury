"use client";
import { useState, useEffect } from "react";
import { useSiteInfo } from "@/lib/store";

function useTheme() {
  const { theme } = useSiteInfo();

  const [state, setState] = useState(null);

  useEffect(() => {
    setState(theme);
  }, [theme]);

  return state;
}

export default useTheme;
