/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "bafybeibnrasojyzexvr232dnuwyykw4v6mrjrcdn3sggjybfwcyenx7u34.ipfs.nftstorage.link",
        port: "",
        pathname: "**",
      },
    ],
  },
};
