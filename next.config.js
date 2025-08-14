/** @type {import('next').NextConfig} */
const nextConfig = {
     productionBrowserSourceMaps: true,
    images: {
        remotePatterns: [
            {
                protocol:"https",
                hostname:"img.clerk.com",
            },
            {
                protocol:"https",
                hostname:"images.unsplash.com"
            }
        ]
    }
}

module.exports = nextConfig
