// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// example
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // console.log("session", session);

  const token = session?.user?.token;
  console.log("token", token);

  res.status(200).json({ name: "John Doe" });
}
