import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "source.unsplash.com",
                port: "",
                pathname: "/random/**"
            },
            {
                protocol: "https",
                hostname: "**"
            }
        ]
    }
};

export default withNextIntl(nextConfig);