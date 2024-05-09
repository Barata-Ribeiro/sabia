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
                text: "hsl(var(--text))",
                background: "hsl(var(--background))",
                primary: "hsl(var(--primary))",
                secondary: "hsl(var(--secondary))",
                accent: "hsl(var(--accent))"
            }
        }
    },
    plugins: [require("@tailwindcss/forms")]
}
export default config
