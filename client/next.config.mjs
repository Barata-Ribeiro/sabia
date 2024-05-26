// @ts-check
import withPlaiceholder from "@plaiceholder/next";
import createNextIntlPlugin from 'next-intl/plugin';


/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
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

const withNextIntl = createNextIntlPlugin();
const withPlugins = (config) => withNextIntl(withPlaiceholder(config));

export default withPlugins(nextConfig);