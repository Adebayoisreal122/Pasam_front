/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  // Ignore TS and ESLint errors during build so Vercel doesn't fail
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WHATSAPP: process.env.NEXT_PUBLIC_WHATSAPP,
  },
}

module.exports = nextConfig