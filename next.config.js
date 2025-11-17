/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Move this outside the remotePatterns array
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "bayshore.nyc3.digitaloceanspaces.com",
      },
    ],
  },
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
