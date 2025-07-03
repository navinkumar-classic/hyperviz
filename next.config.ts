import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/linear', // your target page
                permanent: true, // set to true if SEO/permanent redirect
            },
        ]
    },
}

export default nextConfig
