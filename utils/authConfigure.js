import axios from "axios";
import { google } from "googleapis";
import { API_URL } from "@/config";

const googleClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export async function authConfigure(token) {
  // const url = "https://bayshore-backend.vercel.app/user/token";
  const url = `${API_URL}/user/token`;

  const { data } = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return googleClient.setCredentials(data);
}
