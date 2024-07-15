"use server"

import { ApiResponse } from "@/interfaces/actions"
import { POST_TOGGLE_LIKE } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"

export default async function postTogglePostLike(postId: string) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = POST_TOGGLE_LIKE(postId)
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

        if (!response.ok) throw new Error(responseData.message)

        revalidateTag("feed")
        revalidateTag("post")

        return {
            ok: true,
            clientError: null,
            response: responseData
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
