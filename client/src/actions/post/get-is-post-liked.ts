"use server"

import { ApiResponse } from "@/interfaces/actions"
import { POST_GET_IS_LIKED } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"

export default async function getIsPostLiked(postId: string) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = POST_GET_IS_LIKED(postId)

    try {
        const auth_token = await verifyAuthentication(isEnglishLang)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            next: { revalidate: 30, tags: ["like"] }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as { liked: string }

        return { ok: true, client_error: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
