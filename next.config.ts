
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // No remotePatterns needed if all images are local or served from the same domain.
  // If you later add external image sources, you'll need to configure them here.
  allowedDevOrigins: [
      "https://6000-firebase-studio-1750139631751.cluster-ombtxv25tbd6yrjpp3lukp6zhc.cloudworkstations.dev",
      // Add any other specific development origins if needed
  ],
};

export default nextConfig;
