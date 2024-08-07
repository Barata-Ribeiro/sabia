"use server"

import { ApiResponse } from "@/interfaces/actions"
import { UserPublicProfileResponse } from "@/interfaces/user"
import { GET_USER_RECOMMENDATIONS } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"

export default async function getUserRecommendations() {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = GET_USER_RECOMMENDATIONS()
    const auth_token = await verifyAuthentication(isEnglishLang)

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            next: { revalidate: 60 }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        const data = responseData.data as {
            recommendations: UserPublicProfileResponse[]
        }

        return { ok: true, clientError: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
