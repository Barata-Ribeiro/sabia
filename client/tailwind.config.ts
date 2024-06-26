import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            container: { center: true },
            fontSize: {
                sm: "0.750rem",
                base: "1rem",
                xl: "1.333rem",
                "2xl": "1.777rem",
                "3xl": "2.369rem",
                "4xl": "3.158rem",
                "5xl": "4.210rem"
            },
            fontFamily: {
                heading: ["var(--font-open-sans)", "sans"],
                body: ["var(--font-average-sans)", "sans"]
            },
            colors: {
                body: {
                    50: "var(--body-50)",
                    100: "var(--body-100)",
                    200: "var(--body-200)",
                    300: "var(--body-300)",
                    400: "var(--body-400)",
                    500: "var(--body-500)",
                    600: "var(--body-600)",
                    700: "var(--body-700)",
                    800: "var(--body-800)",
                    900: "var(--body-900)",
                    950: "var(--body-950)"
                },
                background: {
                    50: "var(--background-50)",
                    100: "var(--background-100)",
                    200: "var(--background-200)",
                    300: "var(--background-300)",
                    400: "var(--background-400)",
                    500: "var(--background-500)",
                    600: "var(--background-600)",
                    700: "var(--background-700)",
                    800: "var(--background-800)",
                    900: "var(--background-900)",
                    950: "var(--background-950)"
                },
                primary: {
                    50: "var(--primary-50)",
                    100: "var(--primary-100)",
                    200: "var(--primary-200)",
                    300: "var(--primary-300)",
                    400: "var(--primary-400)",
                    500: "var(--primary-500)",
                    600: "var(--primary-600)",
                    700: "var(--primary-700)",
                    800: "var(--primary-800)",
                    900: "var(--primary-900)",
                    950: "var(--primary-950)"
                },
                secondary: {
                    50: "var(--secondary-50)",
                    100: "var(--secondary-100)",
                    200: "var(--secondary-200)",
                    300: "var(--secondary-300)",
                    400: "var(--secondary-400)",
                    500: "var(--secondary-500)",
                    600: "var(--secondary-600)",
                    700: "var(--secondary-700)",
                    800: "var(--secondary-800)",
                    900: "var(--secondary-900)",
                    950: "var(--secondary-950)"
                },
                accent: {
                    50: "var(--accent-50)",
                    100: "var(--accent-100)",
                    200: "var(--accent-200)",
                    300: "var(--accent-300)",
                    400: "var(--accent-400)",
                    500: "var(--accent-500)",
                    600: "var(--accent-600)",
                    700: "var(--accent-700)",
                    800: "var(--accent-800)",
                    900: "var(--accent-900)",
                    950: "var(--accent-950)"
                }
            }
        }
    },
    plugins: [require("@tailwindcss/forms")({ strategy: "class" })]
}
export default config
