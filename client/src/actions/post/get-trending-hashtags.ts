"use server"

import { ApiResponse } from "@/interfaces/actions"
import { TrendingHashtagsResponse } from "@/interfaces/post"
import { GET_TRENDING_HASHTAGS } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"

export default async function getTrendingHashtags() {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = GET_TRENDING_HASHTAGS()
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

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as TrendingHashtagsResponse

        return { ok: true, clientError: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
