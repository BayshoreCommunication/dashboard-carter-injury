"use client";
import Image from "next/image";

const ConnectedConsole = ({ data }) => {
  return (
    <div>
      <h1 className="font-bold text-xl mb-8">Console Connected With</h1>
      <div className="flex items-center">
        <Image src={data.picture} width="100" height="100" alt="user avater" />

        <div className="px-8">
          <div className="font-semibold">{data.email}</div>
          <div>{data.name}</div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedConsole;
