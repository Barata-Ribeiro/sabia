"use server"

import { ApiResponse } from "@/interfaces/actions"
import { IS_USER_FOLLOWING } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { getLocale } from "next-intl/server"
import { cookies } from "next/headers"

export default async function getIfUserFollows(userId: string, followId: string) {
    const locale = await getLocale()
    const URL = IS_USER_FOLLOWING(userId, followId)

    try {
        const auth_token = cookies().get("auth_token")?.value
        if (!auth_token) return { ok: false, client_error: null, response: null }

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

        const data = responseData.data as { follows: string }

        return {
            ok: true,
            client_error: null,
            response: { ...responseData, data }
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
