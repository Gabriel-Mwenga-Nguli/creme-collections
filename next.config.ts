
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add allowedDevOrigins here, at the top level of the NextConfig object
  // This is to address the "Cross origin request detected" warning during development.
  // You might need to adjust this if your preview URL changes or if you have other origins.
  allowedDevOrigins: [
      "https://6000-firebase-studio-1750139631751.cluster-ombtxv25tbd6yrjpp3lukp6zhc.cloudworkstations.dev",
      // Add any other specific development origins if needed
  ],
};

export default nextConfig;
