/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Change this to your actual GitHub repo name
  // e.g. if your repo is github.com/yourname/cuet-countdown → basePath: "/cuet-countdown"
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
