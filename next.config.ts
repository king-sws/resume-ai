/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from uploads directory
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Configure local images
    domains: ['localhost'],
  },
  // Ensure public folder is accessible
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig