
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
  allowedDevOrigins: [
      "https://6000-firebase-studio-1750139631751.cluster-ombtxv25tbd6yrjpp3lukp6zhc.cloudworkstations.dev",
      // Add any other specific development origins if needed
  ],
};

export default nextConfig;
