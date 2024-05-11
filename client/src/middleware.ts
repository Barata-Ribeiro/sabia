import verifyToken from "@/utils/validate-token"
import createIntlMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"

const EXCLUDE_PATHS = [
    "/",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/terms-of-use",
    "/privacy-policy"
]

const INTL_CONFIG = {
    locales: ["en", "pt-BR"],
    defaultLocale: "en"
}

export async function middleware(req: NextRequest) {
    const auth_token = req.cookies.get("auth_token")?.value
    const path = req.nextUrl.pathname
    let isAuthenticated = false

    const inlMiddleware = createIntlMiddleware({
        locales: INTL_CONFIG.locales,
        defaultLocale: INTL_CONFIG.defaultLocale,
        localePrefix: "always"
    })

    const response = inlMiddleware(req)

    if (auth_token) {
        const isAuthTokenValid = await verifyToken(auth_token)
        if (isAuthTokenValid) isAuthenticated = true
    }

    if (
        !isAuthenticated &&
        !EXCLUDE_PATHS.some((path) => req.nextUrl.pathname.includes(path))
    ) {
        const url = req.nextUrl.clone()
        url.pathname = INTL_CONFIG.defaultLocale + "/"
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    // Match only internationalized pathnames
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
}
