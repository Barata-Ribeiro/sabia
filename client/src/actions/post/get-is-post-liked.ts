"use server"

import logout from "@/actions/auth/logout"
import { ApiResponse } from "@/interfaces/actions"
import { POST_GET_IS_LIKED } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"
import { cookies } from "next/headers"

export default async function getIsPostLiked(postId: string) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = POST_GET_IS_LIKED(postId)

    try {
        const auth_token = cookies().get("auth_token")?.value
        if (!auth_token) {
            await logout()
            throw new Error(isEnglishLang ? "Unauthorized." : "Não autorizado.")
        }

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            },
            cache: "no-store"
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) throw new Error(responseData.message)

        const data = responseData.data as { liked: boolean }

        return { ok: true, client_error: null, response: { ...responseData, data } }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
