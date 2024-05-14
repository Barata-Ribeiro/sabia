import verifyToken from "@/utils/validate-token"
import createIntlMiddleware from "next-intl/middleware"
import { NextRequest } from "next/server"

const inlMiddleware = createIntlMiddleware({
    locales: ["en", "pt-BR"],
    defaultLocale: "en",
    localePrefix: "always"
})

export async function middleware(req: NextRequest) {
    const response = inlMiddleware(req)
    const authToken = req.cookies.get("auth_token")?.value
    let isAuthenticated = false

    if (authToken) {
        const isAuthTokenValid = await verifyToken(authToken)
        if (isAuthTokenValid) isAuthenticated = true
    }

    // TODO... AUTH REDIRECT LOGIC

    return response
}

export const config = {
    // Match only internationalized pathnames
    matcher: [
        // Enable a redirect to a matching locale at the root
        "/",

        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix
        "/(en|pt-BR)/:path*",

        // Enable redirects that add missing locales
        // (e.g. `/pathnames` -> `/en/pathnames`)
        "/((?!api|_next|_vercel|.*\\..*).*)"
    ]
}
