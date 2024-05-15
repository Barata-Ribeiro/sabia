import { locales } from "@/navigation"
import verifyToken from "@/utils/validate-token"
import createIntlMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const authToken = req.cookies.get("auth_token")?.value
    const localePref = req.cookies.get("NEXT_LOCALE")?.value || "en"
    const [, locale, ...segments] = req.nextUrl.pathname.split("/")
    let isAuthenticated = false
    const isRedirectionUrl = req.nextUrl.pathname === `/${localePref}`

    const inlMiddleware = createIntlMiddleware({
        locales,
        defaultLocale: "en",
        localePrefix: "always"
    })

    const response = inlMiddleware(req)

    if (authToken) {
        const isAuthTokenValid = await verifyToken(authToken)
        if (isAuthTokenValid) isAuthenticated = true
    }

    if (
        locale != null &&
        (segments.includes("terms-of-service") || segments.includes("privacy-policy"))
    ) {
        return response
    }

    if (
        !isAuthenticated &&
        !isRedirectionUrl &&
        (!segments.includes("auth") || segments.length === 0)
    ) {
        const url = req.nextUrl.clone()
        url.pathname = `/${localePref}`
        return NextResponse.redirect(new URL(url, req.url))
    }

    if (isAuthenticated && (segments.includes("auth") || segments.length === 0)) {
        const url = req.nextUrl.clone()
        url.pathname = `/${localePref}/home`
        return NextResponse.redirect(new URL(url, req.url))
    }

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
