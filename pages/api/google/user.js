const { google } = require('googleapis');
import axios from 'axios';

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const tokenData = await fetchAccessToken();
    if (!tokenData.tokens.length) {
      return res.status(200).json({ error: 'Error executing request' });
    }
    oauth2Client.setCredentials(tokenData.tokens[0]);
    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client,
    });

    const userData = await getUserProfile(oauth2);
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error executing request', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function fetchAccessToken() {
  const response = await axios.get(
    'https://bayshore-backend.vercel.app/exchange-token'
  );
  if (response.status !== 200) {
    throw new Error('Error obtaining access token');
  }
  return response.data;
}

async function getUserProfile(oauth2) {
  try {
    const response = await oauth2.userinfo.get({
      auth: oauth2Client,
      userId: 'me',
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
