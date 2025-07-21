/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.grok.com"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()", // Minimal policy, excluding experimental features
          },
        ],
      },
    ];
  },
};

export default nextConfig;