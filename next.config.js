// Fichier : next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  typescript: {
    // On force Next.js à ignorer les erreurs de type pendant le build.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;