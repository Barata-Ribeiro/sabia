"use server"

import { ApiResponse } from "@/interfaces/actions"
import { PostResponse } from "@/interfaces/post"
import { POST_REPOST } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"

export default async function postNewRepost(postId: string) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = POST_REPOST(postId)
    const auth_token = await verifyAuthentication(isEnglishLang)

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            body: JSON.stringify({})
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        const data = responseData.data as PostResponse

        revalidateTag("feed")

        return { ok: true, clientError: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
