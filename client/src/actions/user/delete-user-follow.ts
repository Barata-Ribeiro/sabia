"use server"

import { ApiResponse } from "@/interfaces/actions"
import { UNFOLLOW_USER } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import verifyAuthentication from "@/utils/verify-authentication"
import { getLocale } from "next-intl/server"
import { revalidateTag } from "next/cache"

export default async function deleteUserFollow(userId: string, followId: string) {
    const locale = await getLocale()
    const isEnglishLang = locale === "en"
    const URL = UNFOLLOW_USER(userId, followId)

    const auth_token = await verifyAuthentication(isEnglishLang)

    try {
        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + auth_token,
                "Content-Type": "application/json",
                "Content-Language": locale
            }
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) return ResponseError(new Error(responseData.message), locale)

        revalidateTag("feed")
        revalidateTag("context")
        revalidateTag("profile")

        return {
            ok: true,
            clientError: null,
            response: responseData
        }
    } catch (error) {
        return ResponseError(error, locale)
    }
}
