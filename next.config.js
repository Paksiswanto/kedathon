/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jose'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

module.exports = nextConfig