// @ts-check
import withPlaiceholder from "@plaiceholder/next"
import createNextIntlPlugin from "next-intl/plugin"


/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    trailingSlash: false,
    skipTrailingSlashRedirect: true,
    experimental: {
        optimizePackageImports: [
            "tailwindcss", "react-icons/hi2", "react-icons/fa", "react-icons/fa6"
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.unsplash.com",
                port: "",
                pathname: "/photos/**"
            },
            {
                protocol: "https",
                hostname: "**"
            }
        ]
    }
}

const withNextIntl = createNextIntlPlugin()
const withPlugins = (config) => withNextIntl(withPlaiceholder(config))

export default withPlugins(nextConfig)