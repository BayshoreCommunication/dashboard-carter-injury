"use client";
import ConsoleButton from "@/components/Console/ConsoleButton";
import { useEffect, useState } from "react";
import axios from "axios";
import ConnectedConsole from "@/components/Console/ConnectedConsole";

function SearchConsoleForm() {
  const [data, setData] = useState("");
  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/google/user");
      if (res.status === 200) {
        setData(res.data);
      }
    })();
  }, []);
  return (
    <div>{data ? <ConnectedConsole data={data} /> : <ConsoleButton />}</div>
  );
}

export default SearchConsoleForm;
